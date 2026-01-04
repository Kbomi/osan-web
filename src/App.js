import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { ToastContainer } from "react-toastify";
import Header from "./Header";

import "swiper/css";
import "./App.css";
import Card from "./Card";
import Map from "./Map";
import Footer from "./Footer";

const title = {
  restaurant: "근처 맛집 🍱",
  delivery: "배달 맛집 🚴‍♂️",
  dessert: "디저트 맛집 🍩",
  beauty: "미용실 💇‍♀️",
};

function App() {
  const [activeTag, setActiveTag] = useState("restaurant");
  const [data, setData] = useState([]);
  const [isMapView, setIsMapView] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [isSearchEmpty, setIsSearchEmpty] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 클릭된 태그에 맞는 JSON 파일을 동적으로 불러옴
        const module = await import(`./data/${activeTag}.json`);
        const _data = module.default.sort((a, b) => b.id - a.id); // id 높은 순 (추가된 데이터가 먼저 보이도록)
        setData(_data); // JSON 파일의 기본 내보내기를 설정
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    fetchData();
    setIsMapView(false);
  }, [activeTag]); // activeTag가 바뀔 때마다 데이터 불러오기

  const handleSearch = () => {
    if (!searchInput.trim()) {
      setFilteredData([]); // 검색어가 없으면 전체 데이터 표시
      setIsSearchEmpty(false)
      return;
    }

    const keyword = searchInput.toLowerCase();
    const filtered = data.filter((item) => {
      const combinedText = `${item.name} ${item.description} ${item.tags.join(" ")} ${item.category}`.toLowerCase();
      return combinedText.includes(keyword);
    });

    if (!filtered.length) {
      setIsSearchEmpty(true)
    }

    setFilteredData(filtered);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // 기본 동작 방지
      handleSearch();
    }
  };

  const handleChange = (e) => {
    setSearchInput(e.target.value); // 입력 상태 업데이트
  };

  const clearKeyword = () => {
    setSearchInput('');
    setFilteredData([]);
    if (isSearchEmpty) {
      setIsSearchEmpty(false) 
    }
  }

  return (
    <div className="App">
      <Header />

      <div className="search-container">
        <div className="search-input">
          <input
            type="type"
            placeholder="검색"
            className="search-input"
            value={searchInput}
            onChange={handleChange} // 검색어 입력 상태 업데이트
            onKeyDown={handleKeyDown} // Enter 키 이벤트 처리
          />  
          <button type="button" onClick={clearKeyword}>
            <img src={`${process.env.PUBLIC_URL}/icon-close.svg`} alt="검색어 삭제" />
          </button>
        </div>

        <button type="button" onClick={handleSearch}>검색</button>
      </div>
      
      {!isSearchEmpty && !filteredData.length && (
        <Swiper className="tag-list" slidesPerView="auto" spaceBetween={20}>
          <SwiperSlide className={activeTag === "restaurant" ? "active" : ""}>
            <button type="button" onClick={() => setActiveTag("restaurant")}>
              식당 맛집
            </button>
          </SwiperSlide>
          <SwiperSlide className={activeTag === "delivery" ? "active" : ""}>
            <button type="button" onClick={() => setActiveTag("delivery")}>
              배달 맛집
            </button>
          </SwiperSlide>
          <SwiperSlide className={activeTag === "dessert" ? "active" : ""}>
            <button type="button" onClick={() => setActiveTag("dessert")}>
              카페/디저트
            </button>
          </SwiperSlide>
          <SwiperSlide className={activeTag === "beauty" ? "active" : ""}>
            <button type="button" onClick={() => setActiveTag("beauty")}>
              뷰티/패션
            </button>
          </SwiperSlide>
          <SwiperSlide className={activeTag === "hospital" ? "active" : ""}>
            <button type="button" onClick={() => setActiveTag("hospital")}>
              병원
            </button>
          </SwiperSlide>
          <SwiperSlide className={activeTag === "etc" ? "active" : ""}>
            <button type="button" onClick={() => setActiveTag("etc")}>
              기타
            </button>
          </SwiperSlide>
        </Swiper>
      )}

      <div className="card-wrap">
        <div className="title-wrap">
          <h2>{title[activeTag]}</h2>
          {activeTag !== "delivery" && (
            <div>
              <span className="toggle-text">지도로 보기</span>
              <div className="toggle">
                <input
                  type="checkbox"
                  id="mode-toggle"
                  className="toggle__input"
                  checked={isMapView}
                  onChange={() => setIsMapView(!isMapView)}
                />
                <label htmlFor="mode-toggle" className="toggle__label"></label>
              </div>
            </div>
          )}
        </div>

        {isSearchEmpty ? (
          <>
            <p className="text-center">검색 결과가 없습니다. 🙈</p>
            <button type="button" onClick={clearKeyword} className="btn-list">목록 보기</button>
          </>
        ): (
          activeTag !== "delivery" && isMapView ? (
            !filteredData.length ? (<Map data={data} />) : (<Map data={filteredData} />)
          ) : (
            !filteredData.length ? data.map((item) => <Card key={item.id} item={item} />) : filteredData.map((item) => <Card key={item.id} item={item} />)
          )
        )}
      </div>

      <ToastContainer />
      <a
        href="https://forms.gle/A2NsTktdaQ3Q4KbP6"
        target="_blank"
        rel="noopener noreferrer"
        className="floating-button"
        title="설문지로 이동"
      >
        📮
      </a>
      <Footer />
    </div>
  );
}

export default App;
