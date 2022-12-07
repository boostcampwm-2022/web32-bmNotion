import { axiosPostRequest } from '@/utils/axios.request';
import { AxiosResponse } from 'axios';
import React, { useState, ReactElement, useEffect } from 'react';

const convert = (file: any) => {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onload = () => {
      resolve(reader.result);
    };
  });
};

export default function Text(): ReactElement {
  const handleOnPaste = async (e: React.ClipboardEvent<HTMLDivElement>) => {
    const apiUrl = '/api/block/image'
    const headers = { 'Content-Type': 'application/octet-stream' }
    // const headers = {  }
    const onSuccess = (response: AxiosResponse<any, any>) => {
      const imageUrl = response.data
      console.log(imageUrl)
    }
    const onFail = (err: AxiosResponse<any, any>) => {
      console.error(err)
    }
    const clipboardData = e.clipboardData;
    console.log("🚀 ~ file: Test.tsx:7 ~ handleOnPaste ~ clipboardData", clipboardData)
    
    if (clipboardData && clipboardData.files.length > 0) {
      // console.log(clipboardData.items)
      // console.log(clipboardData.files)
      
      const file = clipboardData.files[0];
      console.log("🚀 ~ file: Test.tsx:11 ~ handleOnPaste ~ file", file)
      // console.log(Array.from(clipboardData.items).find(item => item.kind === 'file')?.getAsFile())
      
      if (!/image/.test(file.type)) return;
      e.preventDefault();
      
      const result = await convert(file);
      
      const buf =  await file.arrayBuffer()
      console.log(result);
      console.log(buf)

      axiosPostRequest(apiUrl, onSuccess, onFail, file, headers)
      
      // file.arrayBuffer()
      // file.
      // File
      // lastModified : 1670308967640
      // lastModifiedDate : Tue Dec 06 2022 15:42:47 GMT+0900 (한국 표준시) {}
      // name : "image.png"
      // size : 14759
      // type : "image/png"
    }
  }
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '1000px', margin: 'auto'}}>
      <img
        src='https://item.kakaocdn.net/do/c5c470298d527ef65eb52883f0f186c48f324a0b9c48f77dbce3a43bd11ce785'
        width={'100px'}
        height={'100px'}
        style={{display: 'block'}}
      />
      <div style={{backgroundColor: 'gray', width: '100%'}} contentEditable onPaste={handleOnPaste}>
        블록!
      </div>
      <div style={{backgroundColor: 'gray', width: '100%'}} contentEditable onPaste={handleOnPaste}>
      </div>
    </div>
  )
}
