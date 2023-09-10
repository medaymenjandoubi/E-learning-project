import { useEffect, useState,useContext } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { Badge ,Modal} from "antd";
import { currencyFormatter } from "../../utils/helpers";
import ReactPlayer from "react-player";
import SingleCourseJumbotron from "../../components/cards/SingleCourseJumbotron"
import PreviewModal from "../../components/modal/PreviewModal";
import SingleCourseLesson from "../../components/cards/SingleCourseLessons"
import { Context } from "../../context";
import { toast } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";

const SingleCourse = ({ course }) => {
  // router initialization
  const router = useRouter();
  //slug initialization
  const { slug } = router.query;
  //context
  const {state:{user}} = useContext(Context)
  //state
  const [preview,setPreview] = useState("")
  const [showModal,setShowModal] = useState(false)
  const [loading,setLoading] = useState(false)
  const [enrolled,setEnrolled] = useState()

  useEffect(()=> {
      if (user && course) checkEnrollment()
  },[user, course])

  
  //functions to handle enrollment
    //check 
    const checkEnrollment = async () => {
      const {data} = await axios.get(`/api/check-enrollment/${course._id}`)
      console.log("CHECK ENROLLMENT",data)
      setEnrolled(data)
    }
    //handle free
  const handleFreeEnrollment=async(e)=>{
    /* console.log("handle free enrollment") */
    e.preventDefault()
    try {
      if (!user) router.push("/login")
      if (enrolled.status) return router.push(`/user/course/${enrolled.course.slug}`);
      setLoading(true)
      const {data}= await axios.post(`/api/free-enrollment/${course._id}`);
      console.log("test",data)
      toast(data.message);
      setLoading(false)
      router.push(`/user/course/${data.course.slug}`)
    } catch (err) {
      toast('Enrollment failed. Try again.')
      console.log(err)
      setLoading(false)
    }
  }
    // handle paid
    const handlePaidEnrollment = async () => {
      // console.log("handle paid enrollment");
      try {
        setLoading(true);
        // check if user is logged in
        if (!user) router.push("/login");
        // check if already enrolled
        if (enrolled.status)
          return router.push(`/user/course/${enrolled.course.slug}`);

        const { data } = await axios.post(`/api/paid-enrollment/${course._id}`);
        const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);
        stripe.redirectToCheckout({ sessionId: data });
        
      } catch (err) {
        toast("Enrollment failed, try again.");
        console.log(err);
        setLoading(false);
      }
    };

  return (
    <div>
        <SingleCourseJumbotron 
        course={course} 
        showModal={showModal} 
        setShowModal={setShowModal} 
        preview={preview}
        setPreview={setPreview}
        user={user}
        loading={loading}
        handleFreeEnrollment={handleFreeEnrollment}
        handlePaidEnrollment={handlePaidEnrollment}
        enrolled={enrolled}
        setEnrolled={setEnrolled}/>

      <PreviewModal 
        showModal={showModal} 
        setShowModal={setShowModal} 
        preview={preview}/>
        {course.lessons && (<SingleCourseLesson 
        lessons={course.lessons} 
        setPreview={setPreview}
        showModal={showModal}
        setShowModal={setShowModal}/>)}
    </div>
  );
};

export async function getServerSideProps({ query }) {
  const { data } = await axios.get(`${process.env.API}/course/${query.slug}`);
  return {
    props: {
      course: data,
    },
  };
}

export default SingleCourse;
