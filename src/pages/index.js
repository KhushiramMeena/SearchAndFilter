import { CountryList } from "@/components/CountryList";
import Searchbar from "@/components/Searchbar";
import path from "path";
import fs from "fs";
import _ from "lodash";
import { useEffect, useRef, useState } from "react";

export default function Home({ countries, regions }) {
  const refFilter = useRef(null);
  const refSearch = useRef(null);
  const refList = useRef(null);

  const state = useState({ keywords: '', region: null });

  useEffect(() => {
    const { classList } = refList.current;
    classList.add('animate-fadeIn');
    const timeout = setTimeout(() => classList.remove('animate-fadeIn'), 200);

    return () => clearTimeout(timeout);
  }, [state]);

  return (
    <>
      <div className="grid gap-8 p-7 md:grid-cols-2 ">
        <Searchbar ref={refSearch} state={state} />
      
      </div>
      <div className="grid gap-8 p-7 md:grid-cols-1 xl:px-20 xl:py-14 xl:gap-16">
        <CountryList ref={refList} countries={countries} state={state} />
      </div>
    </>
  );
}

export const getStaticProps = async () => {
  let useLocalData = false;
  let countries = [];
  let regions = [];

  try {
    // Read from the local data.json file
    const file = path.join(process.cwd(), 'src', 'data.json');
    const data = fs.readFileSync(file);
    countries = JSON.parse(data);

    // Get unique regions for filtering
    regions = _.uniq(countries.map(country => country.region).filter(Boolean));
  } catch (error) {
    console.error('Error reading data.json:', error);
    useLocalData = true;
  }

  return {
    props: { countries, regions }
  };
};
