import { axiosPostRequest } from '@/utils/axios.request';
import { AxiosResponse } from 'axios';
import React, { useState, ReactElement, useEffect } from 'react';

export default function Text(): ReactElement {
  const handleOnPaste = async (e: React.ClipboardEvent<HTMLDivElement>) => {
    const apiUrl = '/api/block/image';
    const headers = { 'Content-Type': 'application/octet-stream' };

    const onSuccess = (response: AxiosResponse<any, any>) => {
      const data = response.data;
      const url = data.url;
      /**
       * 이미지 블록 추가 로직 (비어있으면 타입 변경)
       */

      // 이미지 블록 변경 or
      const img = document.createElement('img');
      img.src = url;
      console.log(img.src);
      document.body.append(img);
    };
    const onFail = (err: AxiosResponse<any, any>) => {
      console.error(err);
    };

    const clipboardData = e.clipboardData;
    console.log('🚀 ~ file: Test.tsx:7 ~ handleOnPaste ~ clipboardData', clipboardData);

    if (clipboardData && clipboardData.files.length > 0) {
      const file = clipboardData.files[0];
      if (/image/.test(file.type)) {
        e.preventDefault();
        axiosPostRequest(apiUrl, onSuccess, onFail, file, headers);
      }
    }
  };
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '1000px',
        margin: 'auto',
      }}
    >
      <img
        src="https://item.kakaocdn.net/do/c5c470298d527ef65eb52883f0f186c48f324a0b9c48f77dbce3a43bd11ce785"
        width={'100px'}
        height={'100px'}
        style={{ display: 'block' }}
      />
      <div
        style={{ backgroundColor: 'gray', width: '100%' }}
        contentEditable
        onPaste={handleOnPaste}
      >
        블록!
      </div>
      <div
        style={{ backgroundColor: 'gray', width: '100%' }}
        contentEditable
        onPaste={handleOnPaste}
      ></div>
    </div>
  );
}
