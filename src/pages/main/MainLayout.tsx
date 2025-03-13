import {
	BarChartOutlined,
	EnvironmentOutlined,
	PoweroffOutlined,
	UserOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Button, Layout, Menu, theme } from 'antd'
import React, { useEffect, useState } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import './MainLayout.css'
// import MenuItem from 'antd/es/menu/MenuItem';
import { supabase } from '../../shared/supabaseClient'
import LoginPage from '../login/LoginPage'
import MapManager from '../map/Map'
import StatisticPage from '../statistic/StatisticPage'
import TopicsPage from '../topics/TopicsPage'

const { Content, Sider } = Layout
type MenuItem = Required<MenuProps>['items'][number]
const items: MenuItem[] = [
	{
		key: '*',
		icon: <UserOutlined />,
		label: 'Интересы',
	},
	{
		key: '/map',
		icon: <EnvironmentOutlined />,
		label: 'Карта',
	},
	{
		key: '/statistic',
		icon: <BarChartOutlined />,
		label: 'Статистика',
	},
]

export const MainLayout: React.FC = () => {
	useEffect(() => {
		const checkSession = async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession()

			if (session) {
				navigate('/')
			}

			if (!localStorage.getItem('isAuth')) {
				navigate('/login')
			}
		}
		checkSession()
	}, [])

	const {
		token: { colorBgContainer, borderRadiusLG },
	} = theme.useToken()
	const navigate = useNavigate()
	const [collapsed, setCollapsed] = useState(false)
	const [brokenView, setBrokenView] = useState(false)

	async function logout() {
		supabase.auth.signOut()
		localStorage.removeItem('isAuth')
		navigate('/login')
	}
	return (
		<Layout className='mainContainer'>
			<Sider
				trigger={null}
				collapsible
				collapsed={collapsed}
				className={!brokenView ? 'menuWrapper' : 'menuWrapperNone'}
				breakpoint='xl'
				collapsedWidth='0'
				onBreakpoint={broken => {
					if (broken) {
						setCollapsed(true)
						setBrokenView(true)
						console.log()
					} else {
						setCollapsed(false)
						setBrokenView(false)
					}
				}}
				onCollapse={(collapsed, type) => {
					console.log(collapsed, type)
				}}
			>
				<div>
					<div className='logo' />
					{/* {brokenView ?  
            <Button type="text"
            icon={<CloseOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              position: 'relative',
              color: 'rgba(255, 255, 255, 0.65)',
              fontSize: '16px',
              width: 64,
              height: 64
              }}/>
             : ''} */}
					<Menu
						theme='dark'
						mode='inline'
						className='menuContainer'
						defaultSelectedKeys={['*']}
						items={items}
						onClick={({ key }) => {
							navigate(key)
						}}
					/>
				</div>
				<Button
					className={'buttonSingOut'}
					type='primary'
					color='danger'
					onClick={() => logout()}
				>
					<PoweroffOutlined />
				</Button>
			</Sider>
			<Layout>
				<Content style={{ margin: '24px 16px 0' }}>
					<div
						className='contentWrapper'
						style={{
							padding: 24,
							height: '95vh',
							overflowY: 'auto',
							overflowX: 'hidden',
							background: colorBgContainer, //
							borderRadius: borderRadiusLG,
						}}
					>
						{/* {brokenView ?  
              <Button type="text"
            icon={collapsed ? <BarsOutlined /> : <CloseOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64
              }}/>
             : ''} */}
						<Routes>
							<Route path='login' element={<LoginPage />} />
							<Route path='*' element={<TopicsPage />} />
							<Route path='statistic' element={<StatisticPage />} />
							<Route path='map' element={<MapManager />} />
						</Routes>
					</div>
				</Content>
			</Layout>
		</Layout>
	)
}
