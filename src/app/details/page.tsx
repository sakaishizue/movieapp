'use client'
import React,{Suspense} from 'react';
import { useRouter,useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import { Grid, Typography, Box , Button } from '@mui/material';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const url1 = 'https://api.themoviedb.org/3/movie/';
const url2 = '?api_key=33f42472680147c2a769a49364b87503&language=ja&region=JP';
const url3 = '/credits';
const fetcher = (...args:[RequestInfo, RequestInit?]) => fetch(...args).then(res => res.json());

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DetailsContent/>
    </Suspense>
    )
}

function DetailsContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const {data:data1,error:error1,isLoading:il1} = useSWR(url1 + id + url2,fetcher);
    const {data:data2,error:error2,isLoading:il2} = useSWR(url1 + id + url3 + url2,fetcher);
    const router = useRouter();

    const handleClick = () => {
        router.push('/');
    };

    const handleImgError= (e) => {
      e.target.src = '/noimage.png';
      e.target.onerror = null;
    }
//    console.log(data1);
//    console.log(data2);
  
    if (error1||error2) return <div>エラーが発生しました</div>;
    if (il1||il2) return <div>読み込み中...</div>;
  
    return (
    <>
        <div className='header'>{data1.title}</div>
        <Box sx={{ flexGrow: 1, padding: 2 }} className='mt-20 mb-20'>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6} container justifyContent='center' alignItems='center'>
            <img src={'https://image.tmdb.org/t/p/w400/' + data1.poster_path} onError={handleImgError}/>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" component="div">
              {data1.overview == '' ? '概要文なし' : data1.overview}
            </Typography>
            <Accordion sx={{ backgroundColor: 'lightblue' }}>
              <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header">
                <Typography>詳細</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  原題：{data1.original_title + '(' + data1.release_date.slice(0,4) + ')'}<br/>
                  監督：{data2.crew.map((crew) => crew.job == 'Director' ? crew.name == crew.original_name ?
                    crew.name + '　' : crew.name + '(' + crew.original_name + ')　' : void 0)}<br/>
                  キャスト：{data2.cast.map((cast) => 
                    cast.name == cast.original_name ? cast.name + '　' : cast.name + '(' + cast.original_name + ')　')}<br/>
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>
      </Box>
      <div className='footer'>
        <Button variant='contained' color='secondary' onClick={handleClick}>一覧に戻る</Button> 
      </div>
    </>
    )
}
