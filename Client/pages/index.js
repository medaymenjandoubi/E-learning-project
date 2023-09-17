import { useState, useEffect } from "react";
import axios from "axios";
import CourseCard from "../components/cards/CourseCard";
import { useSearch } from "../context/SearchContext";

const Index = ({ courses }) => {
  const { searchQuery } = useSearch();
  const filteredCourses = courses.filter((course) =>
    course.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <h1 className="jumbotron text-center bg-primary">
        Online Education Marketplace
      </h1>
      <div className="container-fluid">
        <div className="row bg-light p-2">
          {filteredCourses.map((course) => (
            <div key={course._id} className="col-md-4">
              <CourseCard course={course} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps() {
  const { data } = await axios.get(`${process.env.API}/courses`);
  return {
    props: {
      courses: data,
    },
  };
}

export default Index;
