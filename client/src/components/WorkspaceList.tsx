import { axiosGetRequest } from "@/utils/axios.request";
import { AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

interface Workspace {
  title: string;
  id: string;
}

export default function WorkspaceList(){
  const [workspaceList, setWorkspaceList] = useState<Workspace[]>([]);
  
  useEffect(() => {
    const onSuccess = (res: AxiosResponse) => {
      setWorkspaceList(res.data.workspaceList);
    };
    const onFail = (res: AxiosResponse) => {
      console.log(res.data);
    };
    const requestHeader = {
      authorization: localStorage.getItem('jwt'),
    };
    axiosGetRequest('http://localhost:8080/api/workspace/list', onSuccess, onFail, requestHeader);
  }, []);
  return <WorkspaceListWrapper>
  <WorkspaceHeadContent>
    head
  </WorkspaceHeadContent>
  {workspaceList.map((workspace, index) => (
    <div key={index}>{workspace.title}</div>
  ))}
  </WorkspaceListWrapper>
}

const WorkspaceListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: auto;
  overflow: hidden;
`;

const WorkspaceHeadContent = styled.div`
  display: flex;
  line-height: 45px;
  height: 45px;
`;