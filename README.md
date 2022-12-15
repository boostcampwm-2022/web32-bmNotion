# Web32-bmNotion

### Never Break Mind

중요한 건 _"꺾이지 않는 마음"_

| J064                                                                                                                          | J175                                                                                                                                      | J178                                                                                                                                       | J190                                                                                                                                      |
| ----------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| <img src="https://user-images.githubusercontent.com/89392012/206983783-e562b0fb-2a90-4ef0-b7bc-adfacd0c6450.png" width="90" > | <img src='https://user-images.githubusercontent.com/36416495/206983287-49a706c9-d016-4fa2-b5b5-9219f9f53995.png' width="90" height="120"> | <img src='https://user-images.githubusercontent.com/73741112/201021968-869346ed-9bc5-424c-a823-c4352379f643.jpeg' width="90" height="120"> | <img src="https://user-images.githubusercontent.com/82529771/201257534-e18423d3-30f6-4605-b7a0-8b8b104b7fd3.png" width="90" height="120"> |
| [@김현호](https://github.com/hhnn0)                                                                                           | [@장현준](https://github.com/jhj9109)                                                                                                     | [@전인성](https://github.com/jis8140)                                                                                                      | [@정현우](https://github.com/ingyobot)                                                                                                    |

[📜Team ground rule](https://github.com/boostcampwm-2022/web32-bmNotion/wiki/%F0%9F%93%9CTeam-ground-rule)


## 프로젝트 소개


<p align="center">
  <img src="https://user-images.githubusercontent.com/89392012/206983590-4d2142da-35fb-4cd6-8cc8-55d39bf0ba3b.png" alt="logo" width="350" height="350" />
</p> 

### 💻 프로젝트 개요

팀 단위의 워크 스페이스 관리 및 실시간 문서 작업을 제공하는 웹 서비스입니다.

### 📌 기획 의도 및 프로젝트 목표

기존의 서비스들이 웹으로 이식되어 가는 현대 웹 어플리케이션의 흐름에 맞는 서비스를 개발하기로 했습니다. 그 과정에서 사용자의 다양한 동작에 대응할 수 있는 서비스인 에디터를 선정했습니다. 웹 서비스라는 장점을 살려 실시간 공동 편집 기능을 추가했고, 사용자의 편의성을 위해 팀 단위의 문서 그룹화와 블록 단위의 페이지 관리 기능을 추가했습니다. 이 과정에서 전체적인 동작은 Notion을 참고하되 구성 및 구조는 자체적으로 개발하기로 기획했습니다.

### 💁🏻 Wiki

* :clipboard: [Tech Spec](https://github.com/boostcampwm-2022/web32-bmNotion/wiki/Tech-Spec)
* :memo: [Backlog & Loadmap](https://docs.google.com/spreadsheets/d/1mNCnT3gwvBx2rRCcqKtVunsq4QcMKSDxoTbR87z7YYE/edit?usp=sharing)
* :books: [Story Board](https://www.figma.com/file/ArXJTWAcg7QkQBcpoLjotw/bmNotion?node-id=65%3A1227)
* :movie_camera: [시연 영상](https://youtu.be/bPu1uMOYzlw)

## 기술 스택

<p align="center">
<img src="https://user-images.githubusercontent.com/73741112/207519106-6e317c01-3104-4f80-853a-74dcd52fb189.png" width="750" >

<br>

<img src="https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white">
<img src="https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white">
<img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black">
<img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black">
<img src="https://img.shields.io/badge/express-000000?style=for-the-badge&logo=express&logoColor=white">
<img src="https://img.shields.io/badge/webpack-8DD6F9?style=for-the-badge&logo=webpack&logoColor=white">
<img src="https://img.shields.io/badge/jotai-97979A?style=for-the-badge&logo=jotai&logoColor=black">
<img src="https://img.shields.io/badge/styled-components-DB7093?style=for-the-badge&logo=styled-components&logoColor=white">
<img src="https://img.shields.io/badge/mongoDB-47A248?style=for-the-badge&logo=MongoDB&logoColor=white">
<img src="https://img.shields.io/badge/nginx-009639?style=for-the-badge&logo=nginx&logoColor=white">
<img src="https://img.shields.io/badge/pm2-2B037A?style=for-the-badge&logo=pm2&logoColor=black">
<img src="https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white">
</p>

## 기능
### 🎛️ 마크다운 기반 에디터

> 페이지의 내용을 블록 단위로 관리할 수 있습니다.
> 

<br>
<img src="https://user-images.githubusercontent.com/82529771/207522957-94082b6b-5798-4ddf-be58-27d57de96883.gif" alt="마크다운 " width="400" />
<br>

* 마크다운 문법을 사용하여 블록의 스타일 변경 및 텍스트 입력이 가능합니다.

<br>
<img src="https://user-images.githubusercontent.com/82529771/207522961-7de6b084-810d-4cb8-aa51-00a3ed395638.gif" alt="logo" width="400" />
<br>

* 버튼 동작을 통해 블록 추가 및 블록의 스타일 변경이 가능합니다.

<br>
<img src="https://user-images.githubusercontent.com/82529771/207522950-c7901705-b265-4343-ac16-1818a98f83af.gif" alt="logo" width="400" />
<br>

* 버튼 동작을 통해 드래그 앤 드롭하여 블록 순서 변경이 가능합니다.

<br>
<img src="https://user-images.githubusercontent.com/82529771/207522978-22148764-18ff-4c70-afdc-e7dcedafe0e9.gif" alt="logo" width="400" />
<br>

* 클립보드 붙여넣기를 통해 이미지를 이미지블록으로 추가할 수 있습니다.

<br>
<img src="https://user-images.githubusercontent.com/82529771/207522967-efcb432c-2b90-4871-97fa-0f62701fdc47.gif" alt="logo" width="400" />
<br>

* 드래그를 통해 블록 선택 및 다중 블록에 대한 버튼 동작이 가능합니다.

### ⚙️ 워크스페이스 관리

> 팀원을 초대하여 워크스페이스 단위로 문서들을 공유할 수 있습니다.
> 

<br>
<img src="https://user-images.githubusercontent.com/82529771/207522974-a650c259-6014-49fd-9735-cddc72e4ed44.gif" alt="logo" width="400" />
<br>

* 워크스페이스에 팀원을 초대할 수 있습니다.

<br>
<img src="https://user-images.githubusercontent.com/82529771/207522980-b41980de-fe58-4b84-8ef8-5807346d0c2f.gif" alt="logo" width="400" />
<br>

* 새로운 페이지를 생성하고 삭제할 수 있습니다.

### ⛓️ 실시간 공동 편집


> 작성한 문서의 수정 내용이 함께 보고 있는 팀원의 내용에 반영됩니다.

<br>
<img src="https://user-images.githubusercontent.com/82529771/207522970-1a81edd9-da42-40a9-9846-1568f0f3df89.gif" alt="logo" width="400" />
<br>

* 워크스페이스에 초대된 팀원간의 실시간 문서 편집이 제공됩니다.