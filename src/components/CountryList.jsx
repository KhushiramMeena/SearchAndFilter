import { useEffect, useState, createRef, forwardRef } from "react";
import { AiOutlineLoading3Quarters as LoadingIcon, AiOutlineVerticalAlignTop as BackToTopIcon } from "react-icons/ai";
import { kebabCase } from "lodash";
import { useRouter } from "next/router";
import Filter from './Filter';

export const CountryList = forwardRef(({ countries, state }, ref) => {
  const router = useRouter();
  const [itemsPerBatch, setItemsPerBatch] = useState(25);
  const [scroll, setScroll] = useState({ current: 0, max: 0 });
  const [mappedCountries, setMappedCountries] = useState(countries);
  const refTopButton = createRef(null);
  const [isMounted, setIsMounted] = useState(false);
  const [sortingOption, setSortingOption] = useState('');


  // Retrieve likedMap from localStorage on component mount
  const [likedMap, setLikedMap] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedLikedMap = localStorage.getItem("likedMap");
      return storedLikedMap ? JSON.parse(storedLikedMap) : {};
    }
    return {};
  });

  // Check if the component is mounted
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // add scroll listener
  useEffect(() => {
    const handleScroll = () => setScroll({ current: window.scrollY, max: document.body.offsetHeight - window.innerHeight });
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => { window.removeEventListener('scroll', handleScroll); };
  }, []);

  useEffect(() => {
    if (isMounted && scroll.current > 100) refTopButton.current.classList.remove('hidden');
    else if (isMounted) refTopButton.current.classList.add('hidden');

    const moreItemsExist = () => scroll.max - scroll.current < 200 && itemsPerBatch < mappedCountries?.length;
    const timeout = setTimeout(() => setItemsPerBatch(items => (moreItemsExist() ? items + 25 : items)), 500);
    return () => clearTimeout(timeout);
  }, [scroll, itemsPerBatch, mappedCountries, refTopButton, isMounted]);

  useEffect(() => {
    if (isMounted) {
      const [{ highlight, keywords }] = state;

      setMappedCountries(() => {
        if (!(highlight || keywords)) return countries;

        return countries.filter((country) => {
          const ishighlightMatch = !highlight || country.highlight.toLowerCase().includes(highlight.toLowerCase());
          const isKeywordMatch =
            country.applicant_name.toLowerCase().includes(keywords.toLowerCase()) ||
            country.applied_for_jobs.toString().toLowerCase().includes(keywords.toLowerCase()) ||  // Ensure applied_for_jobs is converted to string
            checkMatch(country, keywords);
        
          return ishighlightMatch && isKeywordMatch;
        });
        
      });

      setItemsPerBatch(25);
    }
  }, [state, countries, isMounted]);

  useEffect(() => {
    if (isMounted && typeof window !== 'undefined') {
      localStorage.setItem("likedMap", JSON.stringify(likedMap));
    }
  }, [likedMap, isMounted]);

  const checkMatch = (a, b) => {
    if (b.length < 1) return true;

    const {
      altSpellings = [],
      applicant_name: { official, common },
    } = a;
    let string = altSpellings.join() + official + common;
    string = string.toLowerCase().replaceAll(" ", "");
    const sub = b.toLowerCase().split(" ");
    return sub.every((word) => string.includes(word));
  };



  //////////////////////////////////////////////////Like Button////////////////////////////////////////////////////////
  const LikeButton = ({ applicantName }) => {
    const liked = likedMap[applicantName] || false;

    const handleLike = () => {
      setLikedMap(prevLikedMap => ({
        ...prevLikedMap,
        [applicantName]: !prevLikedMap[applicantName],
      }));
    };

    return (
      <button onClick={handleLike}>
        {liked ? '❤️' : '🤍'}
        
      </button>
      
    );
    
  };





//////////////////////////////////////////////////////////////////////Sorting******************//////////////////////
// Function to update the sorting option
const handleSortChange = (option) => {
  setSortingOption(option);
};

// Function to sort countries based on the selected option
const sortCountries = (a, b) => {
  if (sortingOption === 'number_of_likes') {
    return b.number_of_likes - a.number_of_likes;
  } else if (sortingOption === 'applied_for_jobs') {
    return b.applied_for_jobs - a.applied_for_jobs;
  }
  return 0;
};

// Apply sorting to the mappedCountries array
const sortedCountries = [...mappedCountries].sort(sortCountries);







  useEffect(() => {
    if (isMounted && typeof window !== 'undefined') {
      const storedLikedMap = localStorage.getItem("likedMap");
      setLikedMap(storedLikedMap ? JSON.parse(storedLikedMap) : {});
    }
  }, [isMounted]);

  useEffect(() => {
    if (isMounted && typeof window !== 'undefined') {
      localStorage.setItem("likedMap", JSON.stringify(likedMap));
    }
  }, [likedMap, isMounted]);

  const CountryListItem = ({ country, i }) => {
    const { applicant_name, resume, highlight, applied_for_jobs, number_of_likes } = country;

    
    const liked = likedMap[applicant_name] || false;

    if (isMounted && i < itemsPerBatch) {
    
      return (<>
        <div key={i} className="grid rounded-lg overflow-hidden shadow-lg cursor-pointer dark:bg-dark-blue">
          <div className="class1">
            <h2 className="class2">{applicant_name}</h2>
            <p className="class3">
              <a href={`/${applicant_name.toLowerCase()}-resume`} style={{ color: "blue" }} target="_blank" rel="noopener noreferrer">
                <b>Resume</b>
              </a>
            </p>
            <p className="class4">{highlight}</p>
            <p className="class5">
              <i style={{ color: "grey" }}>Applied for {applied_for_jobs} jobs last month</i>
            </p>
            <p className="class6">
              {liked ? number_of_likes + 1 : number_of_likes} people liked the profile
            </p>
            <p className="class7">
              <span className="class7"><LikeButton applicantName={applicant_name} /></span>
            </p>
          </div>
          <hr />
        
        </div>
        <br/>
        </>
      );

     
    }
    return null;
    
  };


 



  const CountryList = () => {
  
    return isMounted && sortedCountries?.map((country, i) => (

      <CountryListItem key={i} country={country} i={i} />
    ));
  };

  return (
    <>
      <Filter onSort={handleSortChange} />
      <div ref={ref} className="grid px-7 animate-fadeIn text-center">
        <CountryList />
        <BackToTopButton ref={refTopButton} />
      </div>
      <LoadingIcon className={`my-16 animate-spin text-7xl col-span-full justify-self-center${isMounted && itemsPerBatch + 25 > mappedCountries?.length ? ' hidden' : ''}`} />
    </>
  );
});

CountryList.displayName = "CountryList";

const BackToTopButton = forwardRef((props, ref) => {
  const classes = "fixed bottom-5 right-5 sm:bottom-10 sm:right-10 z-10 p-5 rounded-full shadow-md drop-shadow-md " +
    "animate-fadeIn hover:opacity-100 transition-all text-5xl bg-white dark:bg-dark-blue";

  const handleClick = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <button ref={ref} className={classes} onClick={handleClick}>
      <BackToTopIcon />
    </button>
  );
});

BackToTopButton.displayName = "BackToTopButton";
