// ЗАДАЧА:
// Создать мини-приложение, где есть форма, в которой
// текстовый инпут и селект.
// Из селекта можно выбрать тип: "user" или "repo".
//
// В зависимости от того, что выбрано в селекте,
// при отправке формы приложение делает запрос
// на один из следующих эндпоинтов:
//
// https://api.github.com/users/${nickname}
// пример значений: defunkt, ktsn, jjenzz, ChALkeR, Haroenv
//
// https://api.github.com/repos/${repo}
// пример значений: nodejs/node, radix-ui/primitives, sveltejs/svelte
//
// после чего, в списке ниже выводится полученная информация;
// - если это юзер, то его full name и число репозиториев;
// - если это репозиторий, то его название и число звезд.

// ТРЕБОВАНИЯ К ВЫПОЛНЕНИЮ:
// - Типизация всех элементов.
// - Выполнение всего задания в одном файле App.tsx, НО с дроблением на компоненты.
// - Стилизовать или использовать UI-киты не нужно. В задаче важно правильно выстроить логику и смоделировать данные.
// - Задание требуется выполнить максимально правильным образом, как если бы вам нужно было, чтобы оно прошло код ревью и попало в продакшн.

// Все вопросы по заданию и результаты его выполнения присылать сюда - https://t.me/temamint

import React, { useState } from 'react';
import './App.css';

interface User {
  fullName: string;
  publicRepos: number;
}

interface Repo {
  name: string;
  stars: number;
}

type FormData = {
  type: 'user' | 'repo';
  query: string;
};

const Form: React.FC<{ onSubmit: (formData: FormData) => void }> = ({
  onSubmit,
}) => {
  const [type, setType] = useState<FormData['type']>('user');
  const [query, setQuery] = useState<string>('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({ type, query });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="type">Type:</label>
        <select
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value as FormData['type'])}
        >
          <option value="user">User</option>
          <option value="repo">Repo</option>
        </select>
      </div>
      <div>
        <label htmlFor="query">Query:</label>
        <input
          id="query"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          required
        />
      </div>
      <button type="submit">Search</button>
    </form>
  );
};

const App: React.FC = () => {
  const [result, setResult] = useState<User | Repo | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    const { type, query } = formData;
    const url =
      type === 'user'
        ? `https://api.github.com/users/${query}`
        : `https://api.github.com/repos/${query}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (type === 'user') {
        const user: User = {
          fullName: data.name,
          publicRepos: data.public_repos,
        };
        setResult(user);
      } else {
        const repo: Repo = {
          name: data.name,
          stars: data.stargazers_count,
        };
        setResult(repo);
      }
      setError(null);
    } catch (err) {
      setError('Failed to fetch data');
      setResult(null);
    }
  };

  return (
    <div className="App">
      <h2>GitHub Info Fetcher</h2>
      <Form onSubmit={handleSubmit} />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {result && (
        <div>
          {'fullName' in result ? (
            <div>
              <h3>User Info</h3>
              <p>Full Name: {result.fullName}</p>
              <p>Public Repositories: {result.publicRepos}</p>
            </div>
          ) : (
            <div>
              <h3>Repo Info</h3>
              <p>Name: {result.name}</p>
              <p>Stars: {result.stars}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
