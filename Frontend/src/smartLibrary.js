import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Users, 
  FileText, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Calendar, 
  Clock, 
  TrendingUp,
  User,
  Book,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  RefreshCw,
  ChevronRight
} from 'lucide-react';

// API Base URL - Update this to match your backend
const API_BASE = 'http://localhost:3000/api';

// Mock API functions (replace with actual API calls)
const api = {
  // Books
  getBooks: async (search = '') => {
    // Mock data - replace with actual API call
    return [
      { _id: '1', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: '9780141182636', copies: 5, available_copies: 3 },
      { _id: '2', title: 'To Kill a Mockingbird', author: 'Harper Lee', isbn: '9780061120084', copies: 3, available_copies: 1 },
      { _id: '3', title: '1984', author: 'George Orwell', isbn: '9780141036144', copies: 4, available_copies: 2 }
    ];
  },
  
  addBook: async (book) => {
    // Mock - replace with actual API call
    return { ...book, _id: Date.now().toString() };
  },
  
  updateBook: async (id, book) => {
    // Mock - replace with actual API call
    return { ...book, _id: id };
  },
  
  deleteBook: async (id) => {
    // Mock - replace with actual API call
    return true;
  },
  
  // Users
  getUsers: async () => {
    return [
      { _id: '1', name: 'John Doe', email: 'john@example.com', role: 'student' },
      { _id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'faculty' }
    ];
  },
  
  addUser: async (user) => {
    return { ...user, _id: Date.now().toString() };
  },
  
  updateUser: async (id, user) => {
    return { ...user, _id: id };
  },
  
  // Loans
  getLoans: async () => {
    return [
      { 
        _id: '1', 
        user: { _id: '1', name: 'John Doe', email: 'john@example.com' },
        book: { _id: '1', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' },
        issue_date: '2024-01-15',
        due_date: '2024-02-15',
        status: 'ACTIVE'
      }
    ];
  },
  
  issueBook: async (loanData) => {
    return { ...loanData, _id: Date.now().toString(), status: 'ACTIVE' };
  },
  
  returnBook: async (loanId) => {
    return { loan_id: loanId, status: 'RETURNED' };
  },
  
  getOverdueLoans: async () => {
    return [
      {
        _id: '1',
        user: { _id: '1', name: 'John Doe', email: 'john@example.com' },
        book: { _id: '1', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' },
        issue_date: '2024-01-01',
        due_date: '2024-01-15',
        days_overdue: 12
      }
    ];
  },
  
  getSystemStats: async () => {
    return {
      total_books: 150,
      total_users: 45,
      books_available: 89,
      books_borrowed: 61,
      overdue_loans: 5,
      loans_today: 8,
      returns_today: 6
    };
  },
  
  getPopularBooks: async () => {
    return [
      { book_id: '1', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', borrow_count: 25 },
      { book_id: '2', title: '1984', author: 'George Orwell', borrow_count: 22 }
    ];
  },
  
  getActiveUsers: async () => {
    return [
      { user_id: '1', name: 'John Doe', books_borrowed: 15, current_borrows: 3 },
      { user_id: '2', name: 'Jane Smith', books_borrowed: 12, current_borrows: 2 }
    ];
  }
};

const SmartLibrarySystem = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loans, setLoans] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  // Load initial data
  useEffect(() => {
    loadData();
  }, [currentView]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (currentView === 'dashboard') {
        const statsData = await api.getSystemStats();
        setStats(statsData);
      } else if (currentView === 'books') {
        const booksData = await api.getBooks(searchTerm);
        setBooks(booksData);
      } else if (currentView === 'users') {
        const usersData = await api.getUsers();
        setUsers(usersData);
      } else if (currentView === 'loans') {
        const loansData = await api.getLoans();
        setLoans(loansData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setLoading(false);
  };

  const openModal = (type, item = null) => {
    setModalType(type);
    setSelectedItem(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
    setModalType('');
  };

  // Navigation
  const Navigation = () => (
    <nav className="bg-blue-800 text-white p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BookOpen size={24} />
          <h1 className="text-xl font-bold">Smart Library System</h1>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`px-3 py-2 rounded ${currentView === 'dashboard' ? 'bg-blue-600' : 'hover:bg-blue-700'}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setCurrentView('books')}
            className={`px-3 py-2 rounded ${currentView === 'books' ? 'bg-blue-600' : 'hover:bg-blue-700'}`}
          >
            Books
          </button>
          <button
            onClick={() => setCurrentView('users')}
            className={`px-3 py-2 rounded ${currentView === 'users' ? 'bg-blue-600' : 'hover:bg-blue-700'}`}
          >
            Users
          </button>
          <button
            onClick={() => setCurrentView('loans')}
            className={`px-3 py-2 rounded ${currentView === 'loans' ? 'bg-blue-600' : 'hover:bg-blue-700'}`}
          >
            Loans
          </button>
        </div>
      </div>
    </nav>
  );

  // Dashboard View
  const Dashboard = () => {
    const [popularBooks, setPopularBooks] = useState([]);
    const [activeUsers, setActiveUsers] = useState([]);
    const [overdueLoans, setOverdueLoans] = useState([]);

    useEffect(() => {
      const loadDashboardData = async () => {
        try {
          const [popular, active, overdue] = await Promise.all([
            api.getPopularBooks(),
            api.getActiveUsers(),
            api.getOverdueLoans()
          ]);
          setPopularBooks(popular);
          setActiveUsers(active);
          setOverdueLoans(overdue);
        } catch (error) {
          console.error('Error loading dashboard data:', error);
        }
      };
      loadDashboardData();
    }, []);

    return (
      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Books</p>
                <p className="text-2xl font-bold text-gray-800">{stats.total_books || 0}</p>
              </div>
              <BookOpen className="text-blue-500" size={32} />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-800">{stats.total_users || 0}</p>
              </div>
              <Users className="text-green-500" size={32} />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Books Borrowed</p>
                <p className="text-2xl font-bold text-gray-800">{stats.books_borrowed || 0}</p>
              </div>
              <FileText className="text-yellow-500" size={32} />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overdue Loans</p>
                <p className="text-2xl font-bold text-gray-800">{stats.overdue_loans || 0}</p>
              </div>
              <AlertCircle className="text-red-500" size={32} />
            </div>
          </div>
        </div>

        {/* Charts and Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Popular Books */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <TrendingUp className="mr-2" size={20} />
              Popular Books
            </h3>
            <div className="space-y-3">
              {popularBooks.slice(0, 5).map((book, index) => (
                <div key={book.book_id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">{book.title}</p>
                    <p className="text-sm text-gray-600">{book.author}</p>
                  </div>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                    {book.borrow_count} borrows
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Active Users */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <User className="mr-2" size={20} />
              Most Active Users
            </h3>
            <div className="space-y-3">
              {activeUsers.slice(0, 5).map((user) => (
                <div key={user.user_id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.books_borrowed} total borrows</p>
                  </div>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                    {user.current_borrows} active
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Overdue Loans Alert */}
        {overdueLoans.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-red-800 mb-3 flex items-center">
              <AlertCircle className="mr-2" size={20} />
              Overdue Loans ({overdueLoans.length})
            </h3>
            <div className="space-y-2">
              {overdueLoans.slice(0, 3).map((loan) => (
                <div key={loan._id} className="flex items-center justify-between bg-white p-3 rounded border">
                  <div>
                    <p className="font-medium">{loan.book.title}</p>
                    <p className="text-sm text-gray-600">Borrowed by {loan.user.name}</p>
                  </div>
                  <span className="text-red-600 font-medium">{loan.days_overdue} days overdue</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Books View
  const BooksView = () => (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Books Management</h2>
        <button
          onClick={() => openModal('add-book')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700"
        >
          <Plus className="mr-2" size={20} />
          Add Book
        </button>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search books by title, author, or ISBN..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && loadData()}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Author</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ISBN</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Copies</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Available</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {books.map((book) => (
              <tr key={book._id}>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{book.title}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{book.author}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{book.isbn}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{book.copies}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-2 py-1 rounded text-xs ${
                    book.available_copies > 0 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {book.available_copies}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <button
                    onClick={() => openModal('edit-book', book)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => openModal('delete-book', book)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Users View
  const UsersView = () => (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Users Management</h2>
        <button
          onClick={() => openModal('add-user')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700"
        >
          <Plus className="mr-2" size={20} />
          Add User
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user._id}>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-2 py-1 rounded text-xs ${
                    user.role === 'faculty' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <button
                    onClick={() => openModal('edit-user', user)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => openModal('view-loans', user)}
                    className="text-green-600 hover:text-green-800"
                  >
                    <FileText size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Loans View
  const LoansView = () => (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Loans Management</h2>
        <button
          onClick={() => openModal('issue-book')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700"
        >
          <Plus className="mr-2" size={20} />
          Issue Book
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Book</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Issue Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loans.map((loan) => (
              <tr key={loan._id}>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {loan.user?.name || 'Unknown User'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {loan.book?.title || 'Unknown Book'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(loan.issue_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(loan.due_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-2 py-1 rounded text-xs ${
                    loan.status === 'ACTIVE' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {loan.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm space-x-2">
                  {loan.status === 'ACTIVE' && (
                    <>
                      <button
                        onClick={() => openModal('return-book', loan)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <CheckCircle size={16} />
                      </button>
                      <button
                        onClick={() => openModal('extend-loan', loan)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Clock size={16} />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Modal Component
  const Modal = () => {
    const [formData, setFormData] = useState({});

    useEffect(() => {
      if (selectedItem) {
        setFormData(selectedItem);
      } else {
        setFormData({});
      }
    }, [selectedItem]);

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        switch (modalType) {
          case 'add-book':
            await api.addBook(formData);
            setBooks([...books, { ...formData, _id: Date.now().toString() }]);
            break;
          case 'edit-book':
            await api.updateBook(selectedItem._id, formData);
            setBooks(books.map(book => book._id === selectedItem._id ? { ...formData, _id: selectedItem._id } : book));
            break;
          case 'delete-book':
            await api.deleteBook(selectedItem._id);
            setBooks(books.filter(book => book._id !== selectedItem._id));
            break;
          case 'add-user':
            await api.addUser(formData);
            setUsers([...users, { ...formData, _id: Date.now().toString() }]);
            break;
          case 'edit-user':
            await api.updateUser(selectedItem._id, formData);
            setUsers(users.map(user => user._id === selectedItem._id ? { ...formData, _id: selectedItem._id } : user));
            break;
          case 'issue-book':
            await api.issueBook(formData);
            loadData();
            break;
          case 'return-book':
            await api.returnBook(selectedItem._id);
            loadData();
            break;
        }
        closeModal();
      } catch (error) {
        console.error('Error:', error);
      }
    };

    if (!showModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              {modalType === 'add-book' && 'Add New Book'}
              {modalType === 'edit-book' && 'Edit Book'}
              {modalType === 'delete-book' && 'Delete Book'}
              {modalType === 'add-user' && 'Add New User'}
              {modalType === 'edit-user' && 'Edit User'}
              {modalType === 'issue-book' && 'Issue Book'}
              {modalType === 'return-book' && 'Return Book'}
              {modalType === 'extend-loan' && 'Extend Loan'}
            </h3>
            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
              ×
            </button>
          </div>

          {modalType === 'delete-book' ? (
            <div>
              <p className="mb-4">Are you sure you want to delete "{selectedItem?.title}"?</p>
              <div className="flex space-x-2">
                <button
                  onClick={handleSubmit}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Delete
                </button>
                <button
                  onClick={closeModal}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : modalType === 'return-book' ? (
            <div>
              <p className="mb-4">Return "{selectedItem?.book?.title}" borrowed by {selectedItem?.user?.name}?</p>
              <div className="flex space-x-2">
                <button
                  onClick={handleSubmit}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Return Book
                </button>
                <button
                  onClick={closeModal}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {(modalType === 'add-book' || modalType === 'edit-book') && (
                <>
                  <input
                    type="text"
                    placeholder="Title"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Author"
                    value={formData.author || ''}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="text"
                    placeholder="ISBN"
                    value={formData.isbn || ''}
                    onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Number of Copies"
                    value={formData.copies || ''}
                    onChange={(e) => setFormData({ ...formData, copies: parseInt(e.target.value) })}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Available Copies"
                    value={formData.available_copies || ''}
                    onChange={(e) => setFormData({ ...formData, available_copies: parseInt(e.target.value) })}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                </>
              )}

              {(modalType === 'add-user' || modalType === 'edit-user') && (
                <>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <select
                    value={formData.role || 'student'}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="student">Student</option>
                    <option value="faculty">Faculty</option>
                    <option value="admin">Admin</option>
                  </select>
                </>
              )}

              {modalType === 'issue-book' && (
                <>
                  <select
                    value={formData.user_id || ''}
                    onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select User</option>
                    {users.map(user => (
                      <option key={user._id} value={user._id}>{user.name} ({user.email})</option>
                    ))}
                  </select>
                  <select
                    value={formData.book_id || ''}
                    onChange={(e) => setFormData({ ...formData, book_id: e.target.value })}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Book</option>
                    {books.filter(book => book.available_copies > 0).map(book => (
                      <option key={book._id} value={book._id}>
                        {book.title} by {book.author} ({book.available_copies} available)
                      </option>
                    ))}
                  </select>
                  <input
                    type="date"
                    placeholder="Due Date"
                    value={formData.due_date || ''}
                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </>
              )}

              {modalType === 'extend-loan' && (
                <>
                  <div className="mb-4">
                    <p><strong>Book:</strong> {selectedItem?.book?.title}</p>
                    <p><strong>User:</strong> {selectedItem?.user?.name}</p>
                    <p><strong>Current Due Date:</strong> {new Date(selectedItem?.due_date).toLocaleDateString()}</p>
                  </div>
                  <input
                    type="number"
                    placeholder="Extension Days"
                    value={formData.extension_days || ''}
                    onChange={(e) => setFormData({ ...formData, extension_days: parseInt(e.target.value) })}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                    max="30"
                    required
                  />
                </>
              )}

              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  {modalType.includes('add') ? 'Add' : modalType.includes('edit') ? 'Update' : 'Submit'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  };

  // Loading Component
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-64">
      <RefreshCw className="animate-spin text-blue-500" size={32} />
      <span className="ml-2 text-gray-600">Loading...</span>
    </div>
  );

  // Quick Actions Component
  const QuickActions = () => (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-semibold mb-3">Quick Actions</h3>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => openModal('issue-book')}
          className="bg-green-500 text-white px-3 py-2 rounded text-sm hover:bg-green-600 flex items-center"
        >
          <Plus size={16} className="mr-1" />
          Issue Book
        </button>
        <button
          onClick={() => openModal('add-book')}
          className="bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600 flex items-center"
        >
          <BookOpen size={16} className="mr-1" />
          Add Book
        </button>
        <button
          onClick={() => openModal('add-user')}
          className="bg-purple-500 text-white px-3 py-2 rounded text-sm hover:bg-purple-600 flex items-center"
        >
          <User size={16} className="mr-1" />
          Add User
        </button>
        <button
          onClick={() => setCurrentView('loans')}
          className="bg-yellow-500 text-white px-3 py-2 rounded text-sm hover:bg-yellow-600 flex items-center"
        >
          <AlertCircle size={16} className="mr-1" />
          View Overdue
        </button>
      </div>
    </div>
  );

  // Main render
  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      
      <div className="container mx-auto">
        {currentView === 'dashboard' && (
          <>
            <div className="p-6">
              <QuickActions />
            </div>
            {loading ? <LoadingSpinner /> : <Dashboard />}
          </>
        )}
        
        {currentView === 'books' && (
          loading ? <LoadingSpinner /> : <BooksView />
        )}
        
        {currentView === 'users' && (
          loading ? <LoadingSpinner /> : <UsersView />
        )}
        
        {currentView === 'loans' && (
          loading ? <LoadingSpinner /> : <LoansView />
        )}
      </div>

      <Modal />

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-4 mt-12">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 Smart Library System. Built with React and modern web technologies.</p>
        </div>
      </footer>
    </div>
  );
};

export default SmartLibrarySystem;