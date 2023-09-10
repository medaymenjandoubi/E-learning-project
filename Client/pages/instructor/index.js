import { useState, useEffect } from "react";
import axios from "axios";
import InstructorRoute from "../../components/routes/InstructorRoute";
import { Avatar,Tooltip } from "antd";
import Link from "next/link";
import { CheckCircleOutlined,CloseCircleOutlined } from "@ant-design/icons";
const InstructorIndex = () => {
    const [courses,setCourses] = useState([])

    useEffect(()=> {
        loadCourses()
    },[])
    const loadCourses= async()=> {
        const {data}= await axios.get('/api/instructor-courses')
        setCourses(data);
    }
    const myStyle = { marginTop:"-15px", fontSize:"10px"};
    return (
        <InstructorRoute>
            <h1 className="jumbotron text-center square">Instructor Dashboard</h1>
            {/* <pre>{JSON.stringify(courses,null,4)}</pre> */}
            {courses && courses.map((course) => (
                <div className="d-flex align-items-start" style={{marginBottom:"20px"}}>
                    <div className="col-md-1" style={{marginLeft:"20px",marginRight:"10px"}}>
                        <Avatar size={80} src={course.image ? course.image.Location : "/course.png"}/>
                    </div>
                    <div className="col-md-6" style={{marginTop:"10px"}}>
                        <Link href={`/instructor/course/view/${course.slug}`} className="pointer h5 mt-2" style={{color:"#09247d"}}>
                            {course.name}
                        </Link>
                        <p style={{marginTop:"-5px"}}>{course.lessons.length} Lessons</p>
                        {course.lessons.length < 5 ? (
                            <h5 style={myStyle} className="text-warning">At least 5 lessons are required to publish a course</h5>
                        ) : course.published ? (
                            <h5 style={myStyle} className="text-success">Your course is Live in the marketplace</h5>
                        ) : (
                            <h5 style={myStyle} className="text-sucess">Your course is ready to be published</h5>
                        )}
                    </div>
                    <div className="col-md-3 mt-3 text-center">
                        {course.published ? (
                            <Tooltip title="Published">
                                <CheckCircleOutlined className="h5 pointer" style={{ color: "green" }} />
                            </Tooltip>
                        ) : (
                            <Tooltip title="Unpublished">
                                <CloseCircleOutlined className="h5 pointer" style={{ color: "red" }} />
                            </Tooltip>
                        )}
                    </div>
                </div>

            ))}
        </InstructorRoute>
    )
}
export default InstructorIndex;
