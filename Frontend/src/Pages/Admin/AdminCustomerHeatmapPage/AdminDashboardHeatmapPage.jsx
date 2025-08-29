import React, {useEffect, useState} from "react"
import { motion, AnimatePresence } from "framer-motion"

import {ComposableMap, Geographies, Geography, ZoomableGroup} from "react-simple-maps"
import {scaleSequential} from "d3-scale"
import {interpolateYlGnBu} from "d3-scale-chromatic"

import {Users, MapPinHouse, LocateFixed, Plus, Minus} from "lucide-react"
import axios from "axios";

import AdminHeader from '../../../Components/AdminHeader/AdminHeader'

const INDIA_TOPO_JSON = "https://raw.githubusercontent.com/markmarkoh/datamaps/master/src/js/data/ind.topo.json";


export default function AdminDashboardHeatmapPage(){

  const [userLocationStats, setUserLocationStats] = useState([])

  const [stateData, setStateData] = useState([]);
  const [tooltipContent, setTooltipContent] = useState("");
  const [selectedState, setSelectedState] = useState(null);
  const [maxState, setMaxState] = useState(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [zoom, setZoom] = useState(6);

  const baseApiUrl = import.meta.env.VITE_API_BASE_URL

  useEffect(()=> {
    axios
      .get(`${baseApiUrl}/admin/locations/map`, {withCredentials: true})
      .then((res) => {
        const data = res.data.usersLocationData
        setStateData(data)

        if (data.length > 0) {
          let max = data.reduce((prev, curr)=> curr.customerCount > prev.customerCount ? curr : prev)
          setMaxState(max)
        }

        let total = data.reduce((acc, curr) => acc + curr.customerCount, 0)
        setTotalUsers(total)
      })
      .catch((err) => console.error(err))

      axios.get(`${baseApiUrl}/admin/locations/stats`, {withCredentials: true}).then(res=> {
         const newStats = []  
         newStats.push({
            name: "totalCustomers",
            title: "Total Customers",
            value: res.data.totalUsers,
            icon: Users,
            color: "bg-purple-50 text-secondary dark:bg-blue-900/30 dark:text-blue-400"
          },
          {
            name: "topUserLocation",
            title: "Top State with most Customer",
            value: res.data.topUserLocation,
            icon: MapPinHouse,
            color: "bg-amber-50 text-primaryDark dark:bg-amber-900/30 dark:text-amber-400"
          },
          {
            name: "topOrderLocation",
            title: "Top State with most Orders",
            value: res.data.topOrderLocation,
            icon: LocateFixed,
            color: "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400"
          })
          console.log('newStats----->', newStats)

          setUserLocationStats(newStats) 
        }
      )
  }, [])

  const colorScale = scaleSequential()
    .domain([0, Math.max(...stateData.map((s) => s.customerCount)) || 1])
    .interpolator(interpolateYlGnBu)

  const getCustomerCount = (stateName)=> {
    const match = stateData.find( item=> item.state.toLowerCase() === stateName.toLowerCase() )
    return match?.customerCount || 0
  }

  const top5States = [...stateData].sort((a, b)=> b.customerCount - a.customerCount).slice(0, 5)

  const generateColorBuckets = (buckets = 6) => {
    const actualMax = Math.max(...stateData.map((s) => s.customerCount))
    const maxCount = actualMax > 100 ? actualMax : 500
    const step = Math.max(1, Math.ceil(maxCount / (buckets - 1)))
    const ranges = []

    ranges.push({
      from: 0,
      to: 0,
      color: "#ffe0b2", 
    })

    for (let i = 1; i < buckets; i++){
      const from = (i - 1) * step + 1
      const to = i === buckets - 1 ? maxCount : i * step
      const color = colorScale(to)
      ranges.push({ from, to, color })
    }
  return ranges
}


const colorRanges = generateColorBuckets();


  return (
    <section id='adminDashboard'>

      <header>
                
          <AdminHeader heading="Customer Location Heatmap" subHeading="Visualize customer distribution across different states with an interactive heatmap to identify regional engagement"/>

      </header>

      <main >

        <div className="flex flex-col space-y-4 p-6 bg-gray-50 min-h-screen">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {
              userLocationStats && userLocationStats.length > 0 ?
              userLocationStats.map((stat, index)=> (
                <div key={stat.title}
                  className={`flex items-center bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border
                     ${index === 0 && 'border-primary'}`}>
                  <div className="flex items-center">
                    <div className={`p-3 rounded-full ${stat.color} mr-4`}>
                      <stat.icon size={17} />
                    </div>
                    <div>
                      <p className="text-[13px] text-gray-500 dark:text-gray-400">{stat.title}</p>
                      <h3 className="text-[20px] font-bold mt-1">{stat.value}</h3>
                    </div>
                  </div>
                </div>
            ))
            :
              [...Array(3)].map((_, index)=> (
                <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className={`skeleton-loader flex items-center bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border 
                  ${index === 0 && 'border-primary'}`}
                >
                  <div className="flex items-center">
                    <div className='w-[17px] h-[17px] p-3 rounded-full mr-4'></div>
                    <div>
                      <p className="invisible text-[13px] text-gray-500 dark:text-gray-400">Insight Title</p>
                      <h3 className="invisible text-[20px] font-bold mt-1">Insight Value</h3>
                    </div>
                  </div>
              </motion.div>
            ))
            }
          </div>

          <div className="flex flex-col lg:flex-row gap-8">

            <div className="relative w-full lg:w-3/4 h-[600px] border border-gray-300 rounded-[5px] shadow
             bg-white cursor-grab">
              <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                <button
                  onClick={() => setZoom((z) => Math.min(z + 0.5, 10))}
                  className="bg-primaryDark hover:bg-orange-400 text-white rounded px-2 py-1 shadow"
                >
                  <Plus className='h-[15px] w-[15px]'/>
                </button>
                <button
                  onClick={() => setZoom((z) => Math.max(z - 0.5, 1))}
                  className="bg-primaryDark hover:bg-orange-400 text-white rounded px-2 py-1 shadow"
                >
                  <Minus className='h-[15px] w-[15px]'/>
                </button>
              </div>

              <ComposableMap projection="geoMercator">
                <ZoomableGroup zoom={zoom} center={[82.8, 22.6]}>
                  <Geographies geography={INDIA_TOPO_JSON}>
                    {({ geographies }) => geographies && geographies.length > 0 &&
                      geographies.map((geo) => {
                        const stateName = geo.properties?.name || geo.properties?.ST_NM || "Unknown";
                        const count = getCustomerCount(stateName);
                        return (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            fill={count === 0 ? "#f4d4b0" : colorScale(count)}
                            stroke="#fff"
                            strokeWidth={0.6}
                            onMouseEnter={() =>
                              setTooltipContent(`${stateName}: ${count} users`)
                            }
                            onMouseLeave={() => setTooltipContent("")}
                            onClick={() =>
                              setSelectedState({ state: stateName, customerCount: count })
                            }
                            style={{
                              default: { outline: "none" },
                              hover: { fill: "#f4a261", cursor: "pointer", outline: "none" },
                              pressed: { outline: "none" }
                            }}
                          />
                        );
                      })
                    }
                  </Geographies>
                </ZoomableGroup>
              </ComposableMap>

              {tooltipContent && (
                <div className="absolute left-4 bottom-4 bg-white border shadow-md px-4 py-2 rounded text-sm font-medium">
                  {tooltipContent}
                </div>
              )}

              <div className="absolute bottom-4 right-4 flex items-center gap-2 text-sm">
                <span>Low</span>
                <div className="w-32 h-3 bg-gradient-to-r from-[#edf8fb] to-[#2c7fb8] rounded" />
                <span>High</span>
              </div>
            </div>

            <div className="w-full lg:w-1/4 bg-white border border-gray-300 rounded-[5px] shadow p-4 space-y-4">
              <div className="">
                {colorRanges.map((bucket, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-3 px-2 py-1 text-sm">
                    <div
                      className="w-6 h-6 rounded"
                      style={{ backgroundColor: bucket.color, border: "1px solid #ccc" }}
                    ></div>
                    <div className="flex-1">
                      {bucket.from} – {bucket.to}
                      <span className="ml-[5px]"> Customers </span>
                    </div>
                  </div>
                ))}
              </div>
              <h3 className="!mt-[2rem] text-lg text-secondary font-semibold text-left">Top 5 States</h3>
              <div className="flex flex-col gap-[10px]">
                {top5States.map((item, idx) => (
                <div
                  key={item.state}
                  className="flex justify-between px-3 text-gray-700 font-medium"
                >
                  <span className="text-[15px]">{idx + 1}. {item.state}</span>
                  <span>{item.customerCount}</span>
                </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </main>
    </section>
    
  )
}


