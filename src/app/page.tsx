'use client'
import React,{useState} from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { Button,Box } from '@mui/material';
import Image from 'next/image';

const url = 'https://api.themoviedb.org/3/movie/now_playing?api_key=33f42472680147c2a769a49364b87503&language=ja&region=JP&page=';
const fetcher = (...args:[RequestInfo, RequestInit?]) => fetch(...args).then(res => res.json());

export default function Home() {
  const [currentPage,setCurrentPage] = useState(1);
  const {data,error,isLoading} = useSWR(url+currentPage,fetcher);
  const router = useRouter();
  //const [src, setSrc] = useState([]);

  const handleClickPrev = () => {
    setCurrentPage(currentPage => currentPage - 1);
  };
  const handleClickNext = () => {
    setCurrentPage(currentPage => currentPage + 1);
  };
  const handleClickDetails = (event:any) => {
    router.push('/details?id=' + event.target.id);
  };
  const handleImgError= (e) => {
    e.target.src = '/noimage.png';
    e.target.onerror = null;
  }

  console.log(data);
  
  if (error) return <div>エラーが発生しました</div>;
  if (isLoading) return <div>読み込み中...</div>;

  return (
    <main>
      <div className='header'>上映中の映画一覧</div>
      <div className='top-2xl grid grid-cols-3 gap-4 w-[1150px] mx-auto mt-20 mb-20'>
        {data.results.map((movie:any) =>
//         <div className='rounded bg-green-500 text-white p-4 w-[370px]'>
          <Box key={movie.id}>
            {movie.title}
            <img className='cursor-pointer transition-transform duration-300 ease-in-out transform hover:rotate-1' 
            src={'https://image.tmdb.org/t/p/w300_and_h450_bestv2/' + movie.poster_path} 
            width={300} height={450}
            id={movie.id} onClick={handleClickDetails}
            onError={handleImgError}></img>
          </Box>)}
      </div>
      <div className='footer'>
        {currentPage}/{data.total_pages + '　　'}
        <Button className='p-5' variant='contained' color='secondary' disabled={currentPage == 1} onClick={handleClickPrev}>前へ</Button>　
        <Button className='p-5' variant='contained' color='secondary' disabled={currentPage == data.total_pages} onClick={handleClickNext}>次へ</Button> 
      </div>
    </main>
  );
}
