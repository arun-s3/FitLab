import React, {useEffect, useState} from "react"
import './FitnessTrackerStyles.css'
import { motion } from "framer-motion"
import {LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer} from "recharts"

import {toast as sonnerToast} from 'sonner' 
import apiClient from '../../../Api/apiClient'

import {camelToCapitalizedWords} from '../../../Utils/helperFunctions'


export default function MonthlyWeeklyCharts({ title, dataKey, timeRange, onFetchedDatas = () => {} }) {
    
    const chartConfig = {
        workouts: { color: "#3b82f6", name: "Workouts" },
        volume: { color: "#a855f7", name: "Volume (kg)" },
        calories: { color: "#f97316", name: "Calories (kcal)" },
        weight: { color: "#10b981", name: "Weight (kg)" },
        health: { color: "#a855f7", name: "Score" },
        exerciseBreakdown: { color: "#f97316", name: "Exercise Breakdown" },
    }

    const COLORS = ["#3b82f6", "#f97316", "#10b981", "#a855f7", "#ec4899", "#f59e0b"]

    const isPieChart = dataKey === "exerciseBreakdown"
    const isLineChart = dataKey === "weight" || dataKey === "health"
    const isAreaChart = dataKey === "calories"

    let isBarChart = false
    if (!isPieChart && !isLineChart && !isAreaChart) {
        isBarChart = true
    }

    const config = chartConfig[dataKey]

    const [chartDatas, setchartDatas] = useState({ week: [], month: [] })

    const [data, setData] = useState([])

    const [loading, setLoading] = useState(false)

    const baseApiUrl = import.meta.env.VITE_API_BASE_URL

    useEffect(() => {
        const fetchAllStats = async () => {
            try {
                const response = await apiClient.get(`${baseApiUrl}/fitness/tracker/stats/${dataKey}`)
                if (response.status === 200) {
                    const { weeklyDatas, monthlyDatas } = response.data
                    setchartDatas({ week: weeklyDatas, month: monthlyDatas })
                    onFetchedDatas(dataKey, { week: weeklyDatas, month: monthlyDatas })
                }
            } catch (error) {
                if (!error.response) {
                    sonnerToast.error("Network error. Please check your internet.")
                }else {
                    sonnerToast.error("Some error occured while loading the stats")
                }
            } finally {
                setLoading(false)
            }   
        }

        setLoading(true)
        fetchAllStats()
    }, [])

    useEffect(() => {
        if (chartDatas && timeRange) {
            const data = chartDatas[timeRange]
            setData(data)
            setLoading(false)
        }
    }, [chartDatas, timeRange])

    return (
        <motion.div
            className='bg-white rounded-xl p-6 border border-gray-200 shadow-md hover:shadow-lg transition-shadow'
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            whileHover={{ borderColor: "rgba(59, 130, 246, 0.5)" }}>
            <h3 className='text-xl font-bold text-gray-900 mb-6'>{title}</h3>

            {!loading ? (
                <div className='w-full h-64'>
                    <ResponsiveContainer width='100%' height='100%'>
                        {isPieChart && data.length > 0 ? (
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx='50%'
                                    cy='50%'
                                    labelLine={false}
                                    label={({ name, value }) => `${name} ${value}%`}
                                    outerRadius={80}
                                    fill='#8884d8'
                                    dataKey='value'>
                                    {data &&
                                        data.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={COLORS[index % COLORS.length]}
                                                fontSize={13}
                                            />
                                        ))}
                                </Pie>
                                <Tooltip formatter={(value) => `${value}%`} />
                            </PieChart>
                        ) : isAreaChart && data.length > 0 ? (
                            <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                                <defs>
                                    <linearGradient id='colorArea' x1='0' y1='0' x2='0' y2='1'>
                                        <stop offset='5%' stopColor={config.color} stopOpacity={0.8} />
                                        <stop offset='95%' stopColor={config.color} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray='3 3' stroke='rgba(0, 0, 0, 0.1)' />
                                <XAxis dataKey='day' stroke='#9ca3af' fontSize={13} />
                                <YAxis stroke='#9ca3af' fontSize={13} />
                                <Tooltip
                                    contentStyle={{
                                        fontSize: "13px",
                                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                                        border: "1px solid rgba(0, 0, 0, 0.1)",
                                        borderRadius: "8px",
                                    }}
                                    labelStyle={{ color: "#1f2937" }}
                                />
                                <Area
                                    type='monotone'
                                    dataKey='value'
                                    stroke={config.color}
                                    fillOpacity={1}
                                    fill='url(#colorArea)'
                                    fontSize={13}
                                />
                            </AreaChart>
                        ) : isLineChart && data.length > 0 ? (
                            <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray='3 3' stroke='rgba(0, 0, 0, 0.1)' />
                                <XAxis dataKey='day' stroke='#9ca3af' fontSize={13} />
                                <YAxis stroke='#9ca3af' fontSize={13} />
                                <Tooltip
                                    contentStyle={{
                                        fontSize: "13px",
                                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                                        border: "1px solid rgba(0, 0, 0, 0.1)",
                                        borderRadius: "8px",
                                    }}
                                    labelStyle={{ color: "#1f2937" }}
                                />
                                <Line
                                    type='monotone'
                                    dataKey='value'
                                    stroke={config.color}
                                    dot={{ fill: config.color, r: 4 }}
                                    activeDot={{ r: 6 }}
                                    strokeWidth={2}
                                />
                            </LineChart>
                        ) : isBarChart && data.length > 0 ? (
                            <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray='3 3' stroke='rgba(0, 0, 0, 0.1)' />
                                <XAxis dataKey='day' stroke='#9ca3af' fontSize={13} />
                                <YAxis stroke='#9ca3af' fontSize={13} />
                                <Tooltip
                                    contentStyle={{
                                        fontSize: "13px",
                                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                                        border: "1px solid rgba(0, 0, 0, 0.1)",
                                        borderRadius: "8px",
                                    }}
                                    labelStyle={{ color: "#1f2937" }}
                                />
                                <Bar dataKey='value' fill={config.color} radius={[8, 8, 0, 0]} />
                            </BarChart>
                        ) : (
                            <p
                                className='w-full h-full flex items-center justify-center text-muted font-medium tracking-[0.3px]'
                                style={{ wordSpacing: "2px" }}>
                                {`No ${camelToCapitalizedWords(dataKey)} related datas found!`}
                            </p>
                        )}
                    </ResponsiveContainer>
                </div>
            ) : (
                <div className='h-64 w-full'>
                    <div className='w-full h-full skeleton-loader' />
                </div>
            )}
        </motion.div>
    )
}
