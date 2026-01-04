import React, { useState, useEffect } from 'react';

const AppInstallButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [platform, setPlatform] = useState('Unknown');

  const getPlatform = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  
    if (/NAVER/i.test(userAgent)) {
      // 네이버 앱의 경우
      if (/Android/i.test(userAgent)) {
        return 'Android'; // 네이버 앱(Android)
      } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
        return 'iOS'; // 네이버 앱(iOS)
      } else {
        return 'Unknown'; // 네이버 앱이지만 플랫폼 정보가 없는 경우
      }
    }
  
    if (/Android/i.test(userAgent)) {
      return 'Android'; // 일반 Android 브라우저
    }
  
    if (/iPhone|iPad|iPod/i.test(userAgent)) {
      return 'iOS'; // 일반 iOS 브라우저
    }
  
    return 'Unknown'; // 기타 환경
  };
  
  useEffect(() => {
    // 플랫폼 감지
    setPlatform(getPlatform());
    
    if (getPlatform() === 'Android') {
      const handler = (e) => {
        e.preventDefault();
        setDeferredPrompt(e); // PWA 설치 프롬프트 저장
      };

      // Android에서 beforeinstallprompt 이벤트 리스너 등록
      window.addEventListener('beforeinstallprompt', handler);

      // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
      return () => {
        window.removeEventListener('beforeinstallprompt', handler);
      };
    }
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // 바탕화면에 추가 프롬프트 표시
    deferredPrompt.prompt();
    
    // 사용자의 선택을 기다림
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('사용자가 설치를 수락했습니다.');
    } else {
      console.log('사용자가 설치를 거절했습니다.');
    }
    
    // 프롬프트를 재사용하지 않도록 초기화
    setDeferredPrompt(null);
  };

  if (platform === 'iOS') {
    // iOS 환경 안내 메시지
    return (
      <p  className='install-instruction'>
        * <strong>공유 버튼</strong>에서<strong>홈 화면에 추가</strong>를 눌러 앱처럼 <strong>편하게</strong> 사용해보세요.
      </p>
    );
  }

  if (platform === 'Android' && deferredPrompt) {
    // Android 환경 버튼 표시
    return (
      <button type="button" className="install-button" onClick={handleInstallClick}>
        앱 처럼<br />사용
      </button>
    );
  }

  if (/NAVER/i.test(navigator.userAgent)) {
    // 네이버 앱 환경 안내 메시지
    if (platform === 'Android' && deferredPrompt) {
      // Android 환경 버튼 표시
      return (
        <button type="button" className="install-button" onClick={handleInstallClick}>
          앱 처럼<br />사용
        </button>
      );
    }
  }
};

export default AppInstallButton;


// 팝업 만들어서 바로가기 추가 유도 팝업 && ios일 경우 검색해서 대응