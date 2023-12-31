import { useState, useContext, useEffect } from "react";
import axios from "axios";
import {toast} from 'react-toastify'
import { SyncOutlined } from "@ant-design/icons";
import Link from "next/link";
import { Context } from "../context";
import { useRouter } from "next/router";
const forgotPassword = () => {

    //state
    const [email, setEmail] = useState('')
    const [success, setSuccess] = useState(false)
    const [code, setCode] = useState('')
    const [loading, setLoading] = useState(false)
    const [password, setPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    console.log(email)
    // Context
    const {
        state : {user},
    } = useContext(Context)
    //route 
    const router = useRouter();

    //redirect if logged in user 
    useEffect(()=> {
        if (user !== null) router.push("/")
    }, [user]);
const handleSubmit = async (e) => {
    e.preventDefault()
    try {
        //setLoading(true)
        const {data} = await axios.post("/api/forgot-password", {email})
        setSuccess(true)
        toast("Check your email for the secret code ");
        
    } catch (err) {
        setLoading(false)
        toast(err.response.data)
    }
};
const handleResetPassword = async (e) => {
    e.preventDefault()
    //console.log(email,code,newPassword);
    //return;
    try {
        setLoading(true)
        const {data} = await axios.post("/api/reset-password",{
            email,code,newPassword,
        });
        setEmail('');
        setCode('');
        setLoading(false);
        setNewPassword('');
        toast("Great! Now you can log in with your new password ")
        router.push('/login')
    } catch (err) {
        setLoading(false)
        toast(err.response.data);
    }
}

return (
    <>
    <h1 className="jumbotron text-center bg-primary square">
        Forgot Password
    </h1>
    <div className="container col-md-4 offset-md-4 pb-5 text-center">
        <form onSubmit={!success ? handleSubmit : handleResetPassword}>
            <input 
            type="email"
            className="form-control mb-4 p-4"
            value={email}
            onChange={(el) => setEmail(el.target.value)} 
            placeholder="Enter email"
            required
            />
            {success && 
            <>
                <input 
                    type="text"
                    className="form-control mb-4 p-4"
                    value={code}
                    onChange={(el) => setCode(el.target.value)} 
                    placeholder="Enter Secret Code"
                    required
                />
                <input 
                    type="password"
                    className="form-control mb-4 p-4"
                    value={newPassword}
                    onChange={(el) => setNewPassword(el.target.value)} 
                    placeholder="Enter New Password"
                    required
                />
            </>
            }
            <br />
            <button type="Submit"
                    className="btn btn-primary btn-block p-2"
                    disabled={loading || !email}>
                    {loading ? <SyncOutlined spin/>:"Submit"}
            </button>
        </form>

    </div>
    </>
)
}
export default forgotPassword;