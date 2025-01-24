import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EditPost.css';

const EditPost = () => {
  const { postId } = useParams();
  const navigate = useNavigate(); // useNavigate 훅을 사용하여 리디렉션 처리
  const [post, setPost] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');

  useEffect(() => {
    fetch(`/api/posts/${postId}`)
      .then((response) => response.json())
      .then((data) => {
        setPost(data);
        setTitle(data.title);
        setContent(data.content);
        // tags가 undefined일 경우 빈 배열로 초기화 후 join 사용
        setTags((data.tags || []).join(','));
      })
      .catch((error) => console.error('Error fetching post:', error));
  }, [postId]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const postData = {
      title,
      content,
      tags: tags.split(','),
    };

    fetch(`/api/posts/${postId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    })
      .then(() => {
        alert('게시글이 수정되었습니다.');
        navigate('/community'); // 수정 후 커뮤니티 페이지로 리디렉션
      })
      .catch((error) => alert('게시글 수정 실패'));
  };

  return post ? (
    <div>
      <h1>글수정 폼</h1>
      <form onSubmit={handleSubmit}>
        <div>이름: John Doe</div>
        <div>
          제목: <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <br>
        </br>
        <div>
          내용:
          <textarea value={content} onChange={(e) => setContent(e.target.value)} required />
        </div>
        <br>
        </br>
        <div>
          태그: <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} />
        </div>
        <button type="submit">수정</button>
      </form>
    </div>
  ) : (
    <p>Loading...</p>
  );
};

export default EditPost;
