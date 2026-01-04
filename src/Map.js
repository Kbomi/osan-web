import React, { useState, useEffect } from "react";

import "./Map.css";

const { kakao } = window;

function Map({ data }) {
  const [currentOverlay, setCurrentOverlay] = useState(null); // 현재 열린 오버레이 상태를 관리

  const initMap = () => {
    const mapContainer = document.getElementById("map");
    const mapOption = {
      center: new kakao.maps.LatLng(37.1266197293938, 127.071232217144),
      level: 5,
    };

    const newMap = new kakao.maps.Map(mapContainer, mapOption);

    const centerMarkerImage = new kakao.maps.MarkerImage(
      `${process.env.PUBLIC_URL}/icon-home.svg`,
      new kakao.maps.Size(28, 38)
    );

    const currentMarkerImage = new kakao.maps.MarkerImage(
      `${process.env.PUBLIC_URL}/icon-here.svg`,
      new kakao.maps.Size(20, 30)
    );

    const markerImage = new kakao.maps.MarkerImage(
      "https://t1.daumcdn.net/mapjsapi/images/marker.png",
      new kakao.maps.Size(18, 26)
    );

    const centerMarkerPosition = new kakao.maps.LatLng(
      37.1266197293938,
      127.071232217144
    );
    new kakao.maps.Marker({
      position: centerMarkerPosition,
      map: newMap,
      title: "힐스테이트 오산더퍼스트",
      image: centerMarkerImage,
    });

    if (navigator.geolocation) {
      // GeoLocation을 이용해서 접속 위치를 얻어옵니다
      navigator.geolocation.getCurrentPosition(function(position) {
        
        const locPosition = new kakao.maps.LatLng(position.coords.latitude, position.coords.longitude); // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성합니다
        
        const currentMarker = new kakao.maps.Marker({
          position: locPosition,
          map: newMap,
          title: "현재 위치",
          image: currentMarkerImage,
        });

        currentMarker.setMap(newMap); // 현재위치 마커 표기

        const currentInfo = document.createElement("div");
        currentInfo.className = "custom-overlay";
        currentInfo.innerHTML = "<span style='margin: 0;'>현재위치</span>";

        new kakao.maps.CustomOverlay({
          map: newMap,
          position: locPosition,
          content: currentInfo,
          yAnchor: 1.8,
        });

        newMap.setCenter(locPosition);
      });
    } else {
      newMap.setCenter(centerMarkerPosition);
    }

    data.forEach((item) => {
      const markerPosition = new kakao.maps.LatLng(
        item.latitude,
        item.longitude
      );
      const marker = new kakao.maps.Marker({
        position: markerPosition,
        map: newMap,
        image: markerImage,
      });

      const content = document.createElement("div");
      content.className = "custom-overlay";
      content.innerHTML = `
        <span>${item.name}</span>
        <button type="button" class="close-btn">x</button>
      `;

      const overlay = new kakao.maps.CustomOverlay({
        position: markerPosition,
        content: content,
        yAnchor: 1,
      });

      // 마커 클릭 시 커스텀 오버레이 표시
      kakao.maps.event.addListener(marker, "click", () => {
        if (currentOverlay) {
          currentOverlay.setMap(null); // 현재 열려 있는 오버레이 닫기
        }
        // 모든 오버레이 숨기기
        document.querySelectorAll(".custom-overlay").forEach((overlayElem) => {
          overlayElem.style.display = "none";
        });

        // 현재 클릭한 마커의 오버레이만 표시
        overlay.setMap(newMap);
        setCurrentOverlay(overlay);

        // 닫기 버튼 클릭 시 오버레이 닫기
        const closeBtn = content.querySelector(".close-btn");
        closeBtn.addEventListener("click", () => {
          overlay.setMap(null); // 오버레이 닫기
          setCurrentOverlay(null);
        });
      });
    });
  };

  useEffect(() => {
    if (data.length > 0) {
      initMap();
    }
  }, [data]);

  return (
    <div
      id="map"
      className="map-view"
      style={{ width: "100%", height: "500px" }}
    ></div>
  );
}

export default Map;
