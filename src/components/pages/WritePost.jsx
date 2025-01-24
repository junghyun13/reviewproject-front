import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate 훅을 사용
import './WritePost.css';

const WritePost = () => {
  const navigate = useNavigate(); // useNavigate 훅 사용
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    const postData = {
      title,
      content,
      tags: tags.split(','),
    };

    fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    })
      .then(() => {
        alert('게시글이 등록되었습니다.');
        navigate('/community'); // 글 등록 후 커뮤니티 페이지로 리디렉션
      })
      .catch((error) => alert('게시글 등록 실패'));
  };

  return (
    <div>
      <h1>글쓰기 폼</h1>
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
          태그: <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="예: 태그1,태그2" />
        </div>
        <button type="submit">등록</button>
      </form>
    </div>
  );
};

export default WritePost;
