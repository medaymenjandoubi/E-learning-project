import { useState, useEffect, useContext } from 'react';
import {Menu} from 'antd';
import Link from 'next/link';
import {AppstoreOutlined,
    CoffeeOutlined,
LoginOutlined, LogoutOutlined, UserAddOutlined,CarryOutOutlined,TeamOutlined } from '@ant-design/icons';
import {Context} from "../context";
import axios from 'axios';
import { toast } from 'react-toastify';
import {useRouter} from "next/router"
import SearchBar from './SearchBar';
import { useSearch } from '../context/SearchContext';
const {Item,SubMenu,ItemGroup} = Menu; 

const TopNav = () => {
    const [current,setCurrent] = useState("");
    const { state,dispatch } = useContext(Context);
    const { user } = state;
    const router=useRouter();
    const { searchQuery, setSearchQuery } = useSearch();

    const handleSearch = (query) => {
        setSearchQuery(query);
      };

    useEffect(()=> {
        process.browser && setCurrent(window.location.pathname)
        //console.log(window.location.pathname)
    },[process.browser && window.location.pathname])

    const logout= async () => {
        dispatch ({type : "LOGOUT"});
        window.localStorage.removeItem("user");
        const {data} = await axios.get("/api/logout");
        toast(data.message);
        router.push("/login")
    };

    return (
        <Menu theme="dark" mode="horizontal" selectedKeys={[current]} className='mb-2'>
        {user !== null &&  <Item key="/" onClick={e => setCurrent(e.key)} icon={<AppstoreOutlined />}>
            <Link href="/" legacyBehavior>
            <a>RapydLearn</a>
            </Link>
        </Item>}
        
        
        {user && user.role && user.role.includes("Instructor") ? (

            <Item key="/instructor/course/create" onClick={e => setCurrent(e.key)} icon={<CarryOutOutlined />}>
                <Link href="/instructor/course/create" legacyBehavior>
                    Create Course 
                </Link>
            </Item>

        ) : (

            <Item key="/user/become-instructor" onClick={e => setCurrent(e.key)} icon={<TeamOutlined />}>
                <Link href="/user/become-instructor" legacyBehavior>
                    Become Instructor 
                </Link>
            </Item>
            
        )}
        <Item style={{width:'800px', marginLeft:"15%"}} className='itemsearchbar'>
            <SearchBar onSearch={handleSearch} />
        </Item>
        {user === null && (
            <>
            <Item key="/login" onClick={e => setCurrent(e.key)} icon={<LoginOutlined />}>
                <Link href="/login" legacyBehavior>
                <a>Login</a>
                </Link>
            </Item>
            <Item key="/register" onClick={e => setCurrent(e.key)} icon={<UserAddOutlined />}>
                <Link href="/register" legacyBehavior>
                <a>Register</a>
                </Link>
            </Item>
            </>
        )}
        {user && user.role && user.role.includes("Instructor") && 
            <Item key="/instructor" onClick={e => setCurrent(e.key)} icon={<TeamOutlined />} className='float-end'>
                <Link href="/instructor" legacyBehavior>
                    Instructor 
                </Link>
            </Item>
        }
    
        {user !== null && (
        <SubMenu icon={<CoffeeOutlined/>} title={user && user.name} className='float-end'>
            <Item key="/user">
                <Link href="/user">
                    Dashboard
                </Link>
            </Item>
                <Item onClick={logout} icon={<LogoutOutlined />} >
                    Logout
                </Item>

        </SubMenu>
        )}


        </Menu>

    )
}
export default TopNav;