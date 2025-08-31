// src/components/BookScreen.jsx
import React, { useEffect, useState } from "react";

function BookScreen({ categoryName, onHome }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const query = categoryName || "learning";
        const res = await fetch(
          `https://openlibrary.org/search.json?q=${query}&limit=5`
        );
        const data = await res.json();
        setBooks(data.docs || []);
      } catch (err) {
        console.error("Error fetching books:", err);
        setBooks([]);
      }
      setLoading(false);
    };

    fetchBooks();
  }, [categoryName]);

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-gray-100">
      <header className="text-2xl font-bold mb-6">Recommended Books 📚</header>

      {loading ? (
        <p>Loading books...</p>
      ) : books.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          {books.map((book, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center"
            >
              {book.cover_i && (
                <img
                  src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                  alt={book.title}
                  className="w-full h-48 object-cover rounded-lg mb-3"
                />
              )}
              <h3 className="font-semibold text-lg">{book.title}</h3>
              {book.author_name && (
                <p className="text-sm text-gray-700">by {book.author_name.join(", ")}</p>
              )}
              <a
                href={`https://openlibrary.org${book.key}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 text-blue-500 hover:underline"
              >
                View Book
              </a>
            </div>
          ))}
        </div>
      ) : (
        <p>No books found.</p>
      )}

      <button
        onClick={onHome}
        className="mt-6 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition"
      >
        🏠 Back Home
      </button>
    </div>
  );
}

export default BookScreen;
