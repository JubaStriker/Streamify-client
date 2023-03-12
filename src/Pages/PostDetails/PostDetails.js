import React, { useContext } from 'react';
import { useLoaderData } from 'react-router-dom';
import { AiFillLike, AiOutlineComment, AiOutlineShareAlt, AiOutlineLike, AiOutlineSend } from 'react-icons/ai'
import { AuthContext } from '../../Context/AuthProvider/AuthProvider';
import { useQuery } from 'react-query';
import { Button, Textarea } from '@material-tailwind/react';
import { toast } from 'react-hot-toast';

const PostDetails = () => {

    const data = useLoaderData()
    console.log(data?.like?.length)
    const id = data._id
    const { user } = useContext(AuthContext);
    const like = { uid: user.uid }
    const likeArr = data.like;
    const found = likeArr.find(element => element.uid === like.uid);
    let react;
    const foundUid = found?.uid;


    const { data: posts = {}, isFetching, refetch } = useQuery({
        queryKey: ['posts', id],
        queryFn: async () => {
            const res = await fetch(`http://localhost:5000/details/${id}`);
            const data = await res.json();
            return data;
        }
    });


    const handleLike = (id) => {
        fetch(`http://localhost:5000/postlike?id=${id}`, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(like)
        })
            .then(res => res.json())
            .then(data => {
                console.log("data", data)
                refetch()
                if (data.acknowledged === "true") {
                }
                else {
                }
            })
    }

    const handleDisLike = (id) => {
        fetch(`http://localhost:5000/postdislike?id=${id}`, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(like)
        })
            .then(res => res.json())
            .then(data => {
                refetch()
                if (data.acknowledged === "true") {

                }
                else {

                }
            })
    }

    if (foundUid === user?.uid) {
        react = <button onClick={() => handleDisLike(data._id)}>
            <div className='flex items-center gap-1'>
                <div className='flex items-center gap-1'>
                    <AiFillLike className='text-3xl text-blue-600' />
                    <div className='font-semibold'>{posts?.like?.length}</div>
                </div>
                <div>{ }</div>
            </div>
        </button>
    }
    else {
        react = <button onClick={() => handleLike(data._id)}>
            <div className='flex items-center gap-1'>
                <div className='flex items-center gap-1'>
                    <AiOutlineLike className='text-3xl text-blue-600' />
                    <div className='font-semibold'>{posts?.like?.length}</div>
                </div>
                <div>{ }</div>
            </div>
        </button>
    }

    let commenterImg;
    if (user?.photoURL) {
        commenterImg = user.photoURL;
    }
    else {
        commenterImg = "https://cdn-icons-png.flaticon.com/512/1057/1057231.png"
    }
    const handleComment = (e) => {
        e.preventDefault()
        const form = e.target;
        const commentText = form.comment.value;
        const comment = {
            text: commentText,
            commenter: user.displayName,
            commenterImg: commenterImg
        }
        fetch(`http://localhost:5000/postcomment?id=${id}`, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(comment)
        })
            .then(res => res.json())
            .then(data => {
                console.log("data", data)
                form.reset()
                refetch()
            })

    };

    const handleShare = () => {
        const title = data.title
        const description = data.description
        const authorName = data.authorName
        const video = data.video
        const authorImg = data.authorImg
        const like = []
        const comment = []
        const sharedName = user.displayName;
        const sharedImg = commenterImg;

        const post = {
            title,
            description,
            authorName,
            video,
            authorImg,
            like,
            comment,
            sharedName,
            sharedImg
        }

        fetch('http://localhost:5000/shareVideo', {

            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(post)

        })
            .then(res => res.json())
            .then(result => {
                console.log("result", result)
                toast.success("Video shared successfully")
            })


    };





    return (
        <div>
            <video className="w-full mt-2 mx-2 md:mx-auto  h-auto max-w-7xl lg:mx-auto border border-gray-200 rounded-lg dark:border-gray-700" controls>
                <source src={data.video} type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            <div className='max-w-7xl mx-2 md:mx-auto mt-4 text-3xl font-semibold'>
                {data.title}
            </div>

            <div className='max-w-7xl mx-2 md:mx-auto mt-2 text-xl'>
                {data.description}
            </div>
            <div className='max-w-7xl mx-2 md:mx-auto mt-2 flex justify-between items-center gap-4'>
                <div className='flex items-center gap-4'>
                    <div><img src={data.authorImg} alt="" className='h-20 w-20 rounded-full' /></div>

                    <div className='flex flex-col'>
                        <div className='text-sm font-thin'>Uploaded by</div>
                        <div className='text-xl font-medium'>{data.authorName}</div>
                    </div>

                    {data.sharedImg ? <div><img src={data.sharedImg} alt="" className='h-16 w-16 rounded-full' /></div> : ''}
                    {data.sharedName ? <div className='flex flex-col'>
                        <div className='text-sm font-thin'>Shared by</div>
                        <div className='text-lg font-medium'>{data.sharedName}</div>
                    </div> : ""
                    }

                </div>
                <div className='flex gap-0 items-center'>
                    {react}
                    <div className='flex items-center gap-1'>
                        <div>
                            <AiOutlineComment className='text-3xl ml-3' />
                        </div>
                        <div className='font-semibold'>{posts?.comment?.length}</div>
                    </div>
                    <div><AiOutlineShareAlt onClick={handleShare} className='text-3xl ml-3' /></div>
                </div>
            </div>
            <div>
                <form onSubmit={handleComment}>
                    <div className='max-w-7xl mx-2 md:mx-auto mt-10'>
                        <Textarea name="comment" variant="standard" label="Comment" placeholder='                      Leave a comment' />
                    </div>
                    <div className='max-w-7xl mx-2 md:mx-auto mt-10 p-0'>
                        <Button type='submit'><AiOutlineSend className='text-2xl' /></Button>
                    </div>
                </form>
            </div>

            <div>
                {posts?.comment?.map((c, i) =>
                    <div key={i} className='border-none m-2 bg-base-200 max-w-7xl mx-2 md:mx-auto mt-10 rounded-lg'>
                        <div className='flex justify-start items-center'>
                            <div className="w-8 rounded-full mx-4 my-4">
                                <img src={c.commenterImg} alt="" className='rounded-full' />
                            </div>
                            <div>
                                <h1 className='text-lg font-bold'>{c.commenter}</h1>
                            </div>
                        </div>
                        <h1 className='mx-4 pb-2 text-lg'>{c.text}</h1>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PostDetails;