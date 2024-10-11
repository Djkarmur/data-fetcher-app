import React, { useEffect, useState } from "react";
import { Post } from "../types";
import axios from "axios";
import { Bounce, toast, ToastContainer } from "react-toastify";
import ReactPaginate from "react-paginate";

const PostsPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [postsPerPage, setPostsPerPage] = useState(10);
  //   const [shouldRenderPagination,setShouldRenderPagination] = useState(true);

  //   const postsPerPage = 10;
  const pagesVisited = currentPage * postsPerPage;
  let shouldRenderPagination = filteredPosts.length > postsPerPage;
  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/posts")
      .then((response) => {
        setPosts(response.data);
        setFilteredPosts(response.data);
      })
      .catch((error) => {
        toast.error("Failed to fetch data. Please try again.");
        console.error("Failed to fetch data. Please try again.");
      });
  }, []);

  useEffect(() => {
    const filtered = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.body.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPosts(filtered);
    setCurrentPage(0);
    // if(filtered.length <= postsPerPage){

    // }
  }, [searchTerm, posts]);

  const handlePageClick = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  const displayPosts = filteredPosts
    .slice(pagesVisited, pagesVisited + postsPerPage)
    .map((post) => (
      <div key={post.id} className="bg-white shadow-md rounded-lg p-6 mb-4">
        <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
        <p className="text-gray-700">{post.body}</p>
      </div>
    ));

  const handlePageChange = (event: { target: { value: any } }) => {
    const value = event.target.value;
    setPostsPerPage(parseInt(value));
  };
  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Posts</h1>

      <input
        type="text"
        placeholder="Search posts..."
        className="block w-full px-4 py-2 border rounded-md mb-6"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {displayPosts.length > 0 ? (
        displayPosts
      ) : (
        <h3 className="text-2xl font-bold mb-6 text-center mt-16">
          No Posts Available!
        </h3>
      )}
      {shouldRenderPagination && (
        <div className="flex justify-center items-center ">
          <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            pageCount={Math.ceil(filteredPosts.length / postsPerPage)}
            onPageChange={handlePageClick}
            containerClassName="flex justify-center space-x-2 mt-6"
            previousLinkClassName="bg-blue-500 text-white px-3 py-2 rounded-md"
            nextLinkClassName="bg-blue-500 text-white px-3 py-2 rounded-md"
            pageLinkClassName="px-3 py-2 border rounded-md"
            activeClassName="bg-blue-500 text-white"
          />
          <select
            name="pageCapicity"
            className="ml-8 px-4 py-2 bg-sky-200 text-xl mt-4 rounded-md place-content-center"
            value={postsPerPage}
            onChange={handlePageChange}
           
          >
            <option value="5">5</option>
            <option value="10">10</option>
          </select>
        </div>
      )}
    </div>
  );
};

export default PostsPage;
