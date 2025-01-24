/* global kakao */
import './Map.css';
import { useEffect, useState } from 'react';

function App() {
  const [isSecondSidebarOpen, setIsSecondSidebarOpen] = useState(false); // 두 번째 사이드바 상태
  const [selectedOption, setSelectedOption] = useState(''); // 선택된 옵션
  const [keyword, setKeyword] = useState('');
  const [places, setPlaces] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);

  const handleSidebarClick = (option) => {
    setSelectedOption(option);
    setIsSecondSidebarOpen(true);
  };

  // 키워드로 장소 검색 함수
  const searchPlaces = () => {
    if (!window.kakao || !window.kakao.maps) {
      alert('Kakao Maps API is not loaded yet.');
      return;
    }

    if (!keyword.trim()) {
      alert('키워드를 입력해주세요!');
      return;
    }

    const ps = new kakao.maps.services.Places();
    ps.keywordSearch(keyword, (data, status) => {
      if (status === kakao.maps.services.Status.OK) {
        setPlaces(data);
      } else {
        alert('검색 결과가 없습니다.');
      }
    });
  };

  // 스크립트 로드 함수
  const new_script = (src) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;

      script.addEventListener('load', resolve);
      script.addEventListener('error', () =>
        reject(new Error(`Failed to load script: ${src}`))
      );

      document.head.appendChild(script);
    });
  };

  useEffect(() => {
    const my_script = new_script(
      'https://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=c7958a7c0d07a3b72a7fee938b0703d8&libraries=services'
    );

    my_script
      .then(() => {
        const kakao = window.kakao;
        kakao.maps.load(() => {
          const mapContainer = document.getElementById('map');
          const options = {
            center: new kakao.maps.LatLng(37.566826, 126.9786567),
            level: 3,
          };
          const newMap = new kakao.maps.Map(mapContainer, options);
          setMap(newMap);

          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                console.log('내 위치 위도:', lat);
                console.log('내 위치 경도:', lon);
                const userLatLng = new kakao.maps.LatLng(lat, lon);
                setUserLocation(userLatLng);

                const userMarker = new kakao.maps.Marker({
                  position: userLatLng,
                  title: '내 위치',
                });
                userMarker.setMap(newMap);
                newMap.setCenter(userLatLng);
              },
              (error) => {
                console.error(error);
                alert('사용자 위치를 가져올 수 없습니다.');
              }
            );
          } else {
            alert('이 브라우저는 Geolocation을 지원하지 않습니다.');
          }
        });
      })
      .catch((error) => {
        console.error('Failed to load Kakao Maps API:', error.message || error);
        alert('지도 로드에 실패했습니다. API 키와 네트워크 상태를 확인하세요.');
      });
  }, []);

  useEffect(() => {
    if (!map) return;

    markers.forEach((marker) => marker.setMap(null));
    setMarkers([]);

    if (places.length > 0) {
      const bounds = new kakao.maps.LatLngBounds();
      const newMarkers = [];

      places.forEach((place, idx) => {
        const position = new kakao.maps.LatLng(place.y, place.x);
        const marker = addMarker(position, idx, place.place_name);
        newMarkers.push(marker);
        bounds.extend(position);
      });

      map.setBounds(bounds);
      setMarkers(newMarkers);
    }
  }, [places]);

  // 마커 생성 및 지도에 추가 함수
  const addMarker = (position, idx, title) => {
    const kakao = window.kakao;
    const imageSrc =
      'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png';
    const imageSize = new kakao.maps.Size(36, 37);
    const imgOptions = {
      spriteSize: new kakao.maps.Size(36, 691),
      spriteOrigin: new kakao.maps.Point(0, idx * 46 + 10),
      offset: new kakao.maps.Point(13, 37),
    };

    const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions);
    const marker = new kakao.maps.Marker({
      position,
      image: markerImage,
    });

    marker.setMap(map);

    const infowindow = new kakao.maps.InfoWindow({
      content: `<div style="padding:5px;">${title}</div>`,
    });

    kakao.maps.event.addListener(marker, 'mouseover', () => infowindow.open(map, marker));
    kakao.maps.event.addListener(marker, 'mouseout', () => infowindow.close());

    return marker;
  };

  return (
    <div className="App">
      <div className="sidebar">
        <a href="#" onClick={() => handleSidebarClick('검색')}>
          검색
        </a>
        <a href="#" onClick={() => handleSidebarClick('길찾기')}>
          길찾기
        </a>
        <a href="#" onClick={() => handleSidebarClick('찜')}>
          찜
        </a>
        <a href="#" onClick={() => handleSidebarClick('인기 키워드')}>
          인기 키워드
        </a>
      </div>

      {isSecondSidebarOpen && (
        <div className="second-sidebar">
          <h3>{selectedOption}</h3>
          <p>{`${selectedOption}에 대한 상세 내용이 여기에 표시됩니다.`}</p>
          <button onClick={() => setIsSecondSidebarOpen(false)}>닫기</button>
        </div>
      )}

      <div id="map" className="map"></div>
    </div>
  );
}

export default App;
