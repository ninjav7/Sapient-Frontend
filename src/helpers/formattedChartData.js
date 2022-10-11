import { DateRangeStore } from '../store/DateRangeStore';
import React, { useState, useEffect } from 'react';


export const getFormattedTimeIntervalData=(data, startDate, endDate)=>{
  

    //console.log("new",startDate)
    let ee=startDate.toLocaleDateString()
    let str=new Date(ee);
    let a=str.getMonth()+1;
    let b=str.getDate();
    let mon=a<10?"0"+a:a;
    let dt=b<10?"0"+b:b
    let ss=str.getFullYear()+"-"+mon+"-"+dt+"T00:00:00.000Z"
    let startTime=new Date(ss);
    let st=startTime.getTime();

    let ff=endDate.toLocaleDateString()
    let stre=new Date(ff);
    let ab=stre.getMonth()+1;
    let ba=stre.getDate()+1;
    let mone=ab<10?"0"+ab:ab;
    let dte=ba<10?"0"+ba:ba
    let sse=stre.getFullYear()+"-"+mone+"-"+dte+"T00:00:00.000Z"
    let endTime=new Date(sse);
    let et=endTime.getTime();
    let newArr=[];
    for(let i=st,j=1;i<=et;i+=900000){
        let tt=new Date();
        if(data[j]!==undefined)
            tt=new Date(data[j][0]);
        if(tt.getTime()===i){
            let te=new Date(i);
            newArr.push([te,data[j][1]])
            j++;
        }
        else{
            let te=new Date(i);
            newArr.push([te,null])
        }
    }
    return newArr;
}