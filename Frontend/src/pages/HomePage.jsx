import React, { useState, useEffect, useCallback,useRef } from 'react'; // Import useCallback
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

import Typed from 'typed.js';



const HomePage = () => {

  const el = useRef(null);    //imported from typed.js Githib Library
  useEffect(() => {                            
    const typed = new Typed(el.current, {
      strings: ['Quant!', 'Finance!', 'Research!'],
      typeSpeed: 50,
      backSpeed: 25,
      loop: true,
    });

    return () => {
      typed.destroy();
    };
  }, []); 

  
  const [selectedSection, setSelectedSection] = useState('home');
  const [events, setEvents] = useState([]);
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    venue: '',
    tags: '',
    image: '', 
  });

  
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    technologies: '',
    status: 'ongoing',
    github: '',
    demo: '',
  });

  
  const [newMember, setNewMember] = useState({
    name: '',
    role: '',
    type: 'Core',
    photo: '', 
    bio: '',
    linkedin: '',
  });

 
  const [newGalleryItem, setNewGalleryItem] = useState({
    image: '',
    caption: '',
    tags: '',
  });


  const [editingEvent, setEditingEvent] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [editingMember, setEditingMember] = useState(null);
  const [editingGalleryItem, setEditingGalleryItem] = useState(null);


  const API_BASE_URL = 'http://localhost:3000'; 

  
  const getToken = useCallback(() => localStorage.getItem('jwtToken'), []); 

 
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const token = getToken();
      if (!token) {
        setError('Authentication required. Please sign in to view events.');
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/events`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, 
        },
      });

      const data = await response.json();   //AWAIT PAUSE EXECUTION UNTIL A PROMISE IS RESOLVED

      if (response.ok) {
        setEvents(data);
      } else {
        setError(data.error || 'Failed to fetch events.');
        console.error('API Error:', data.error);
      }
    } catch (err) {
      setError('Network error. Could not fetch events.');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);  //ENSURES THAT BUTTON TO BE DISBALED IN LOADING PHASE
    }
  }, [getToken, setLoading, setError, setEvents, API_BASE_URL]); 

 
  const handleAddEvent = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const token = getToken();
      if (!token) {
        setError('Authentication required. Please sign in.');
        return;
      }

      const eventData = {
        ...newEvent,
        tags: newEvent.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        date: newEvent.date ? new Date(newEvent.date).toISOString() : undefined,
      };

      const response = await fetch(`${API_BASE_URL}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(eventData),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Event added successfully!'); 
        setNewEvent({ title: '', description: '', date: '', venue: '', tags: '', image: '' });
        fetchEvents(); // Refresh list
      } else {
        setError(data.error || 'Failed to add event.');
        console.error('API Error:', data.error);
      }
    } catch (err) {
      setError('Network error. Could not add event.');
      console.error('Fetch error:', err);
    }
  };

  
  const handleUpdateEvent = async (e) => {
    e.preventDefault();  //TO STOP PAGE RELOAD
    setError('');
    try {
      const token = getToken();
      if (!token) {
        setError('Authentication required. Please sign in.');
        return;
      }

      const eventData = {
        ...editingEvent,
        tags: editingEvent.tags.split(',').map(tag => tag.trim()).filter(tag => tag),//map is uded to transform elements in js
        date: editingEvent.date ? new Date(editingEvent.date).toISOString() : undefined,
      };

      const response = await fetch(`${API_BASE_URL}/events/${editingEvent._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(eventData),  //convert array or oject in json string
      });

      const data = await response.json();

      if (response.ok) {
        alert('Event updated successfully!');
        setEditingEvent(null);
        fetchEvents(); 
      } else {
        setError(data.error || 'Failed to update event.');
        console.error('API Error:', data.error);
      }
    } catch (err) {
      setError('Network error. Could not update event.');
      console.error('Fetch error:', err);
    }
  };

 
  const handleDeleteEvent = async (eventId) => {
    setError('');
    if (!window.confirm('Are you sure you want to delete this event?')) { 
      return;
    }
    try {
      const token = getToken();
      if (!token) {
        setError('Authentication required. Please sign in.');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert('Event deleted successfully!');
        fetchEvents();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete event.');
        console.error('API Error:', data.error);
      }
    } catch (err) {
      setError('Network error. Could not delete event.');
      console.error('Fetch error:', err);
    }
  };


  
  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const token = getToken();
      if (!token) {
        setError('Authentication required. Please sign in to view projects.');
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/projects`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setProjects(data);
      } else {
        setError(data.error || 'Failed to fetch projects.');
        console.error('API Error:', data.error);
      }
    } catch (err) {
      setError('Network error. Could not fetch projects.');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [getToken, setLoading, setError, setProjects, API_BASE_URL]); 


  const handleAddProject = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const token = getToken();
      if (!token) {
        setError('Authentication required. Please sign in.');
        return;
      }

      const projectData = {
        ...newProject,
        technologies: newProject.technologies.split(',').map(tech => tech.trim()).filter(tech => tech),
      };

      const response = await fetch(`${API_BASE_URL}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(projectData),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Project added successfully!'); 
        setNewProject({ title: '', description: '', technologies: '', status: 'ongoing', github: '', demo: '' });
        fetchProjects(); 
      } else {
        setError(data.error || 'Failed to add project.');
        console.error('API Error:', data.error);
      }
    } catch (err) {
      setError('Network error. Could not add project.');
      console.error('Fetch error:', err);
    }
  };

  
  const handleUpdateProject = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const token = getToken();
      if (!token) {
        setError('Authentication required. Please sign in.');
        return;
      }

      const projectData = {
        ...editingProject,
        technologies: editingProject.technologies.split(',').map(tech => tech.trim()).filter(tech => tech),
      };

      const response = await fetch(`${API_BASE_URL}/projects/${editingProject._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(projectData),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Project updated successfully!');
        setEditingProject(null); 
        fetchProjects(); 
      } else {
        setError(data.error || 'Failed to update project.');
        console.error('API Error:', data.error);
      }
    } catch (err) {
      setError('Network error. Could not update project.');
      console.error('Fetch error:', err);
    }
  };

 
  const handleDeleteProject = async (projectId) => {
    setError('');
    if (!window.confirm('Are you sure you want to delete this project?')) { // Use custom modal in real app
      return;
    }
    try {
      const token = getToken();
      if (!token) {
        setError('Authentication required. Please sign in.');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert('Project deleted successfully!');
        fetchProjects(); 
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete project.');
        console.error('API Error:', data.error);
      }
    } catch (err) {
      setError('Network error. Could not delete project.');
      console.error('Fetch error:', err);
    }
  };


  const fetchMembers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const token = getToken();
      if (!token) {
        setError('Authentication required. Please sign in to view members.');
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/members`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setMembers(data);
      } else {
        setError(data.error || 'Failed to fetch members.');
        console.error('API Error:', data.error);
      }
    } catch (err) {
      setError('Network error. Could not fetch members.');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [getToken, setLoading, setError, setMembers, API_BASE_URL]); 

  // Add Member
  const handleAddMember = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const token = getToken();
      if (!token) {
        setError('Authentication required. Please sign in.');
        return;
      }

      const memberData = {
        ...newMember,
      };

      const response = await fetch(`${API_BASE_URL}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(memberData),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Member added successfully!');
        setNewMember({ name: '', role: '', type: 'Core', photo: '', bio: '', linkedin: '' });
        fetchMembers(); 
      } else {
        setError(data.error || 'Failed to add member.');
        console.error('API Error:', data.error);
      }
    } catch (err) {
      setError('Network error. Could not add member.');
      console.error('Fetch error:', err);
    }
  };

 
  const handleUpdateMember = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const token = getToken();
      if (!token) {
        setError('Authentication required. Please sign in.');
        return;
      }

      const memberData = {
        ...editingMember,
      };

      const response = await fetch(`${API_BASE_URL}/members/${editingMember._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(memberData),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Member updated successfully!');
        setEditingMember(null); 
        fetchMembers(); 
      } else {
        setError(data.error || 'Failed to update member.');
        console.error('API Error:', data.error);
      }
    } catch (err) {
      setError('Network error. Could not update member.');
      console.error('Fetch error:', err);
    }
  };

 
  const handleDeleteMember = async (memberId) => {
    setError('');
    if (!window.confirm('Are you sure you want to delete this member?')) { 
      return;
    }
    try {
      const token = getToken();
      if (!token) {
        setError('Authentication required. Please sign in.');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/members/${memberId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert('Member deleted successfully!');
        fetchMembers(); 
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete member.');
        console.error('API Error:', data.error);
      }
    } catch (err) {
      setError('Network error. Could not delete member.');
      console.error('Fetch error:', err);
    }
  };



  const fetchGalleryItems = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const token = getToken();
      if (!token) {
        setError('Authentication required. Please sign in to view gallery.');
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/gallery`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setGalleryItems(data);
      } else {
        setError(data.error || 'Failed to fetch gallery items.');
        console.error('API Error:', data.error);
      }
    } catch (err) {
      setError('Network error. Could not fetch gallery items.');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [getToken, setLoading, setError, setGalleryItems, API_BASE_URL]);

  
  const handleAddGalleryItem = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const token = getToken();
      if (!token) {
        setError('Authentication required. Please sign in.');
        return;
      }

      const galleryData = {
        ...newGalleryItem,
        tags: newGalleryItem.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      };

      const response = await fetch(`${API_BASE_URL}/gallery`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(galleryData),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Gallery item added successfully!'); 
        setNewGalleryItem({ image: '', caption: '', tags: '' });
        fetchGalleryItems(); // Refresh list
      } else {
        setError(data.error || 'Failed to add gallery item.');
        console.error('API Error:', data.error);
      }
    } catch (err) {
      setError('Network error. Could not add gallery item.');
      console.error('Fetch error:', err);
    }
  };


  const handleUpdateGalleryItem = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const token = getToken();
      if (!token) {
        setError('Authentication required. Please sign in.');
        return;
      }

      const galleryData = {
        ...editingGalleryItem,
        tags: editingGalleryItem.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      };

      const response = await fetch(`${API_BASE_URL}/gallery/${editingGalleryItem._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(galleryData),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Gallery item updated successfully!');
        setEditingGalleryItem(null);
        fetchGalleryItems(); 
      } else {
        setError(data.error || 'Failed to update gallery item.');
        console.error('API Error:', data.error);
      }
    } catch (err) {
      setError('Network error. Could not update gallery item.');
      console.error('Fetch error:', err);
    }
  };

 
  const handleDeleteGalleryItem = async (galleryItemId) => {
    setError('');
    if (!window.confirm('Are you sure you want to delete this gallery item?')) { 
      return;
    }
    try {
      const token = getToken();
      if (!token) {
        setError('Authentication required. Please sign in.');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/gallery/${galleryItemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert('Gallery item deleted successfully!');
        fetchGalleryItems(); 
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete gallery item.');
        console.error('API Error:', data.error);
      }
    } catch (err) {
      setError('Network error. Could not delete gallery item.');
      console.error('Fetch error:', err);
    }
  };



  useEffect(() => {
    
    if (selectedSection === 'events') {
      fetchEvents();
    } else if (selectedSection === 'projects') {
      fetchProjects();
    } else if (selectedSection === 'members') {
      fetchMembers();
    } else if (selectedSection === 'gallery') {
      fetchGalleryItems();
    }
  }, [selectedSection, fetchEvents, fetchProjects, fetchMembers, fetchGalleryItems]); 

  const handleNavLinkClick = (section) => {
    setSelectedSection(section);
    setError(''); 
    setEditingEvent(null);
    setEditingProject(null);
    setEditingMember(null);
    setEditingGalleryItem(null);
  };

  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="navbar-left">
          <img src="https://profnitt.nitt.edu/profnitt_logo.png" alt="ProfNITT Logo" className="navbar-logo" />
        </div>
        <div className="navbar-right">
          <ul className="nav-links">
            {/* New HOME link */}
            <li><a href="#" onClick={() => handleNavLinkClick('home')} className="nav-link">HOME</a></li>
            <li><a href="#" onClick={() => handleNavLinkClick('events')} className="nav-link">EVENTS</a></li>
            <li><a href="#" onClick={() => handleNavLinkClick('projects')} className="nav-link">PROJECTS</a></li>
            <li><a href="#" onClick={() => handleNavLinkClick('members')} className="nav-link">MEMBERS</a></li>
            <li><a href="#" onClick={() => handleNavLinkClick('gallery')} className="nav-link">GALLERY</a></li>
            {/* Use navigate for external routing to /signin */}
            <li><a href="#" onClick={() => navigate('/signin')} className="nav-link">LOG OUT</a></li>
          </ul>
        </div>
      </nav>

      <div className="content-area">
        {error && <p className="error-message">{error}</p>}
        {loading && <p className="loading-message">Loading...</p>}

        {selectedSection === 'home' && (
          <div className="home-section">
            <div className="home-content-left">
              <h1 className="home-title">ProfNITT Admin Panel</h1>
              <p className="home-description">The Finance and Investments club of NIT Trichy</p>
              <p className="home-tagline">We are <span ref={el} /></p>
            </div>
            <div className="home-content-right">
              <img
                src="home.png"
                alt="Business Development Analysis"
                className="home-image"
              />
            </div>
          </div>
        )}

        {selectedSection === 'events' && (
          <div className="events-management-section">
            <h2 className="section-title">Event Management</h2>

            {/* Add Event Section */}
            <div className="event-form-card">
              <h3>Add New Event</h3>
              <form onSubmit={handleAddEvent}>
                <div className="form-group">
                  <label htmlFor="newEventTitle" className="form-label">Title:</label>
                  <input
                    type="text"
                    id="newEventTitle"
                    className="event-input"
                    placeholder="Event Title"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="newEventDescription" className="form-label">Description:</label>
                  <textarea
                    id="newEventDescription"
                    className="event-textarea"
                    placeholder="Event Description"
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  ></textarea>
                </div>
                <div className="form-group">
                  <label htmlFor="newEventDate" className="form-label">Date:</label>
                  <input
                    type="date"
                    id="newEventDate"
                    className="event-input"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="newEventVenue" className="form-label">Venue:</label>
                  <input
                    type="text"
                    id="newEventVenue"
                    className="event-input"
                    placeholder="Event Venue"
                    value={newEvent.venue}
                    onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="newEventTags" className="form-label">Tags (comma-separated):</label>
                  <input
                    type="text"
                    id="newEventTags"
                    className="event-input"
                    placeholder="e.g., workshop, tech, finance"
                    value={newEvent.tags}
                    onChange={(e) => setNewEvent({ ...newEvent, tags: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="newEventImage" className="form-label">Optional Image URL:</label>
                  <input
                    type="text"
                    id="newEventImage"
                    className="event-input"
                    placeholder="Image URL"
                    value={newEvent.image}
                    onChange={(e) => setNewEvent({ ...newEvent, image: e.target.value })}
                  />
                </div>
                <button type="submit" className="event-button add-button">Add Event</button>
              </form>
            </div>

            {/* Display Events (Read operation) */}
            <div className="event-list-card">
              <h3>Existing Events</h3>
              {events.length === 0 ? (
                <p>No events found. Add a new event above!</p>
              ) : (
                <ul className="event-list">
                  {events.map((event) => (
                    <li key={event._id} className="event-item">
                      <h4>{event.title}</h4>
                      <p>{event.description}</p>
                      <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
                      <p><strong>Venue:</strong> {event.venue}</p>
                      <p><strong>Tags:</strong> {event.tags.join(', ')}</p>
                      {event.image && <img src={event.image} alt={event.title} className="event-image-preview" />}
                      <div className="event-item-actions">
                        <button
                          className="event-button update-button"
                          onClick={() => setEditingEvent({
                            ...event,
                            date: event.date ? new Date(event.date).toISOString().split('T')[0] : '', 
                            tags: event.tags.join(', ') 
                          })}
                        >
                          Edit
                        </button>
                        <button
                          className="event-button remove-button"
                          onClick={() => handleDeleteEvent(event._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Update Event Section */}
            {editingEvent && (
              <div className="event-form-card">
                <h3>Edit Event: {editingEvent.title}</h3>
                <form onSubmit={handleUpdateEvent}>
                  <div className="form-group">
                    <label htmlFor="editEventTitle" className="form-label">Title:</label>
                    <input
                      type="text"
                      id="editEventTitle"
                      className="event-input"
                      placeholder="Event Title"
                      value={editingEvent.title}
                      onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="editEventDescription" className="form-label">Description:</label>
                    <textarea
                      id="editEventDescription"
                      className="event-textarea"
                      placeholder="Event Description"
                      value={editingEvent.description}
                      onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                    ></textarea>
                  </div>
                  <div className="form-group">
                    <label htmlFor="editEventDate" className="form-label">Date:</label>
                    <input
                      type="date"
                      id="editEventDate"
                      className="event-input"
                      value={editingEvent.date}
                      onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="editEventVenue" className="form-label">Venue:</label>
                    <input
                      type="text"
                      id="editEventVenue"
                      className="event-input"
                      placeholder="Event Venue"
                      value={editingEvent.venue}
                      onChange={(e) => setEditingEvent({ ...editingEvent, venue: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="editEventTags" className="form-label">Tags (comma-separated):</label>
                    <input
                      type="text"
                      id="editEventTags"
                      className="event-input"
                      placeholder="e.g., workshop, tech, finance"
                      value={editingEvent.tags}
                      onChange={(e) => setEditingEvent({ ...editingEvent, tags: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="editEventImage" className="form-label">Optional Image URL:</label>
                    <input
                      type="text"
                      id="editEventImage"
                      className="event-input"
                      placeholder="Image URL"
                      value={editingEvent.image}
                      onChange={(e) => setEditingEvent({ ...editingEvent, image: e.target.value })}
                    />
                  </div>
                  <div className="event-item-actions">
                    <button type="submit" className="event-button add-button">Save Changes</button>
                    <button type="button" className="event-button remove-button" onClick={() => setEditingEvent(null)}>Cancel</button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {selectedSection === 'projects' && (
          <div className="events-management-section">
            <h2 className="section-title">Project Management</h2>

            {/* Add Project Section */}
            <div className="event-form-card">
              <h3>Add New Project</h3>
              <form onSubmit={handleAddProject}>
                <div className="form-group">
                  <label htmlFor="newProjectTitle" className="form-label">Title:</label>
                  <input
                    type="text"
                    id="newProjectTitle"
                    className="event-input"
                    placeholder="Project Title"
                    value={newProject.title}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="newProjectDescription" className="form-label">Brief Description:</label>
                  <textarea
                    id="newProjectDescription"
                    className="event-textarea"
                    placeholder="Brief description of the project"
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  ></textarea>
                </div>
                <div className="form-group">
                  <label htmlFor="newProjectTechnologies" className="form-label">Technologies Used (comma-separated):</label>
                  <input
                    type="text"
                    id="newProjectTechnologies"
                    className="event-input"
                    placeholder="e.g., React, Node.js, Python"
                    value={newProject.technologies}
                    onChange={(e) => setNewProject({ ...newProject, technologies: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="newProjectStatus" className="form-label">Status:</label>
                  <select
                    id="newProjectStatus"
                    className="event-input"
                    value={newProject.status}
                    onChange={(e) => setNewProject({ ...newProject, status: e.target.value })}
                  >
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="newProjectGitHub" className="form-label">GitHub Link:</label>
                  <input
                    type="url"
                    id="newProjectGitHub"
                    className="event-input"
                    placeholder="https://github.com/your-project"
                    value={newProject.github}
                    onChange={(e) => setNewProject({ ...newProject, github: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="newProjectDemo" className="form-label">Demo Link (Optional):</label>
                  <input
                    type="url"
                    id="newProjectDemo"
                    className="event-input"
                    placeholder="https://your-project-demo.com"
                    value={newProject.demo}
                    onChange={(e) => setNewProject({ ...newProject, demo: e.target.value })}
                  />
                </div>
                <button type="submit" className="event-button add-button">Add Project</button>
              </form>
            </div>

            {/* Display Projects */}
            <div className="event-list-card">
              <h3>Existing Projects</h3>
              {projects.length === 0 ? (
                <p>No projects found. Add a new project above!</p>
              ) : (
                <ul className="event-list">
                  {projects.map((project) => (
                    <li key={project._id} className="event-item">
                      <h4>{project.title}</h4>
                      <p>{project.description}</p>
                      <p><strong>Technologies:</strong> {project.technologies.join(', ')}</p>
                      <p><strong>Status:</strong> {project.status}</p>
                      {project.github && <p><a href={project.github} target="_blank" rel="noopener noreferrer">GitHub</a></p>}
                      {project.demo && <p><a href={project.demo} target="_blank" rel="noopener noreferrer">Demo</a></p>}
                      <div className="event-item-actions">
                        <button
                          className="event-button update-button"
                          onClick={() => setEditingProject({
                            ...project,
                            technologies: project.technologies.join(', ')
                          })}
                        >
                          Edit
                        </button>
                        <button
                          className="event-button remove-button"
                          onClick={() => handleDeleteProject(project._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Update Project Section */}
            {editingProject && (
              <div className="event-form-card">
                <h3>Edit Project: {editingProject.title}</h3>
                <form onSubmit={handleUpdateProject}>
                  <div className="form-group">
                    <label htmlFor="editProjectTitle" className="form-label">Title:</label>
                    <input
                      type="text"
                      id="editProjectTitle"
                      className="event-input"
                      placeholder="Project Title"
                      value={editingProject.title}
                      onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="editProjectDescription" className="form-label">Brief Description:</label>
                    <textarea
                      id="editProjectDescription"
                      className="event-textarea"
                      placeholder="Brief description of the project"
                      value={editingProject.description}
                      onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                    ></textarea>
                  </div>
                  <div className="form-group">
                    <label htmlFor="editProjectTechnologies" className="form-label">Technologies Used (comma-separated):</label>
                    <input
                      type="text"
                      id="editProjectTechnologies"
                      className="event-input"
                      placeholder="e.g., React, Node.js, Python"
                      value={editingProject.technologies}
                      onChange={(e) => setEditingProject({ ...editingProject, technologies: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="editProjectStatus" className="form-label">Status:</label>
                    <select
                      id="editProjectStatus"
                      className="event-input"
                      value={editingProject.status}
                      onChange={(e) => setEditingProject({ ...editingProject, status: e.target.value })}
                    >
                      <option value="ongoing">Ongoing</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="editProjectGitHub" className="form-label">GitHub Link:</label>
                    <input
                      type="url"
                      id="editProjectGitHub"
                      className="event-input"
                      placeholder="https://github.com/your-project"
                      value={editingProject.github}
                      onChange={(e) => setEditingProject({ ...editingProject, github: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="editProjectDemo" className="form-label">Demo Link (Optional):</label>
                    <input
                      type="url"
                      id="editProjectDemo"
                      className="event-input"
                      placeholder="https://your-project-demo.com"
                      value={editingProject.demo}
                      onChange={(e) => setEditingProject({ ...editingProject, demo: e.target.value })}
                    />
                  </div>
                  <div className="event-item-actions">
                    <button type="submit" className="event-button add-button">Save Changes</button>
                    <button type="button" className="event-button remove-button" onClick={() => setEditingProject(null)}>Cancel</button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {selectedSection === 'members' && (
          <div className="events-management-section">
            <h2 className="section-title">Team Members Management</h2>

            {/* Add Member Section */}
            <div className="event-form-card">
              <h3>Add New Member</h3>
              <form onSubmit={handleAddMember}>
                <div className="form-group">
                  <label htmlFor="newMemberName" className="form-label">Name:</label>
                  <input
                    type="text"
                    id="newMemberName"
                    className="event-input"
                    placeholder="Member's Full Name"
                    value={newMember.name}
                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="newMemberRole" className="form-label">Role:</label>
                  <input
                    type="text"
                    id="newMemberRole"
                    className="event-input"
                    placeholder="e.g., Developer, Designer"
                    value={newMember.role}
                    onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="newMemberType" className="form-label">Type:</label>
                  <select
                    id="newMemberType"
                    className="event-input"
                    value={newMember.type}
                    onChange={(e) => setNewMember({ ...newMember, type: e.target.value })}
                  >
                    <option value="Core">Core</option>
                    <option value="Manager">Manager</option>
                    <option value="Coordinator">Coordinator</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="newMemberPhoto" className="form-label">Photo URL:</label>
                  <input
                    type="text"
                    id="newMemberPhoto"
                    className="event-input"
                    placeholder="Photo URL"
                    value={newMember.photo}
                    onChange={(e) => setNewMember({ ...newMember, photo: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="newMemberBio" className="form-label">Bio:</label>
                  <textarea
                    id="newMemberBio"
                    className="event-textarea"
                    placeholder="A brief biography of the member"
                    value={newMember.bio}
                    onChange={(e) => setNewMember({ ...newMember, bio: e.target.value })}
                  ></textarea>
                </div>
                <div className="form-group">
                  <label htmlFor="newMemberLinkedIn" className="form-label">LinkedIn Profile:</label>
                  <input
                    type="url"
                    id="newMemberLinkedIn"
                    className="event-input"
                    placeholder="https://linkedin.com/in/member-profile"
                    value={newMember.linkedin}
                    onChange={(e) => setNewMember({ ...newMember, linkedin: e.target.value })}
                  />
                </div>
                <button type="submit" className="event-button add-button">Add Member</button>
              </form>
            </div>

            {/* Display Members */}
            <div className="event-list-card">
              <h3>Existing Members</h3>
              {members.length === 0 ? (
                <p>No members found. Add a new member above!</p>
              ) : (
                <ul className="event-list">
                  {members.map((member) => (
                    <li key={member._id} className="event-item">
                      {member.photo && <img src={member.photo} alt={member.name} className="event-image-preview" />}
                      <h4>{member.name}</h4>
                      <p><strong>Role:</strong> {member.role}</p>
                      <p><strong>Type:</strong> {member.type}</p>
                      <p>{member.bio}</p>
                      {member.linkedin && <p><a href={member.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn Profile</a></p>}
                      <div className="event-item-actions">
                        <button
                          className="event-button update-button"
                          onClick={() => setEditingMember({ ...member })}
                        >
                          Edit
                        </button>
                        <button
                          className="event-button remove-button"
                          onClick={() => handleDeleteMember(member._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Update Member Section */}
            {editingMember && (
              <div className="event-form-card">
                <h3>Edit Member: {editingMember.name}</h3>
                <form onSubmit={handleUpdateMember}>
                  <div className="form-group">
                    <label htmlFor="editMemberName" className="form-label">Name:</label>
                    <input
                      type="text"
                      id="editMemberName"
                      className="event-input"
                      placeholder="Member's Full Name"
                      value={editingMember.name}
                      onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="editMemberRole" className="form-label">Role:</label>
                    <input
                      type="text"
                      id="editMemberRole"
                      className="event-input"
                      placeholder="e.g., Developer, Designer"
                      value={editingMember.role}
                      onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="editMemberType" className="form-label">Type:</label>
                    <select
                      id="editMemberType"
                      className="event-input"
                      value={editingMember.type}
                      onChange={(e) => setEditingMember({ ...editingMember, type: e.target.value })}
                    >
                      <option value="Core">Core</option>
                      <option value="Manager">Manager</option>
                      <option value="Coordinator">Coordinator</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="editMemberPhoto" className="form-label">Photo URL:</label>
                    <input
                      type="text"
                      id="editMemberPhoto"
                      className="event-input"
                      placeholder="Photo URL"
                      value={editingMember.photo}
                      onChange={(e) => setEditingMember({ ...editingMember, photo: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="editMemberBio" className="form-label">Bio:</label>
                    <textarea
                      id="editMemberBio"
                      className="event-textarea"
                      placeholder="A brief biography of the member"
                      value={editingMember.bio}
                      onChange={(e) => setEditingMember({ ...editingMember, bio: e.target.value })}
                    ></textarea>
                  </div>
                  <div className="form-group">
                    <label htmlFor="editMemberLinkedIn" className="form-label">LinkedIn Profile:</label>
                    <input
                      type="url"
                      id="editMemberLinkedIn"
                      className="event-input"
                      placeholder="https://linkedin.com/in/member-profile"
                      value={editingMember.linkedin}
                      onChange={(e) => setEditingMember({ ...editingMember, linkedin: e.target.value })}
                    />
                  </div>
                  <div className="event-item-actions">
                    <button type="submit" className="event-button add-button">Save Changes</button>
                    <button type="button" className="event-button remove-button" onClick={() => setEditingMember(null)}>Cancel</button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {selectedSection === 'gallery' && (
          <div className="events-management-section">
            <h2 className="section-title">Gallery Management</h2>

            {/* Add Image Section */}
            <div className="event-form-card">
              <h3>Add New Image</h3>
              <form onSubmit={handleAddGalleryItem}>
                <div className="form-group">
                  <label htmlFor="newGalleryImageURL" className="form-label">Image URL:</label>
                  <input
                    type="url"
                    id="newGalleryImageURL"
                    className="event-input"
                    placeholder="Image URL"
                    value={newGalleryItem.image}
                    onChange={(e) => setNewGalleryItem({ ...newGalleryItem, image: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="newImageCaption" className="form-label">Caption (Optional):</label>
                  <textarea
                    id="newImageCaption"
                    className="event-textarea"
                    placeholder="A brief caption for the image"
                    value={newGalleryItem.caption}
                    onChange={(e) => setNewGalleryItem({ ...newGalleryItem, caption: e.target.value })}
                  ></textarea>
                </div>
                <div className="form-group">
                  <label htmlFor="newImageTags" className="form-label">Tags (comma-separated, Optional):</label>
                  <input
                    type="text"
                    id="newImageTags"
                    className="event-input"
                    placeholder="e.g., event, project, team"
                    value={newGalleryItem.tags}
                    onChange={(e) => setNewGalleryItem({ ...newGalleryItem, tags: e.target.value })}
                  />
                </div>
                <button type="submit" className="event-button add-button">Add Image</button>
              </form>
            </div>

            {/* Display Gallery Items */}
            <div className="event-list-card">
              <h3>Existing Gallery Items</h3>
              {galleryItems.length === 0 ? (
                <p>No gallery items found. Add a new image above!</p>
              ) : (
                <div className="gallery-grid">
                  {galleryItems.map((item) => (
                    <div key={item._id} className="gallery-item">
                      <img src={item.image} alt={item.caption || 'Gallery Image'} className="gallery-image" />
                      {item.caption && <p className="gallery-caption">{item.caption}</p>}
                      {item.tags && item.tags.length > 0 && (
                        <p className="gallery-tags">Tags: {item.tags.join(', ')}</p>
                      )}
                      <div className="event-item-actions">
                        <button
                          className="event-button update-button"
                          onClick={() => setEditingGalleryItem({
                            ...item,
                            tags: item.tags.join(', ')
                          })}
                        >
                          Edit
                        </button>
                        <button
                          className="event-button remove-button"
                          onClick={() => handleDeleteGalleryItem(item._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Update Image Section */}
            {editingGalleryItem && (
              <div className="event-form-card">
                <h3>Edit Gallery Item: {editingGalleryItem.caption || 'No Caption'}</h3>
                <form onSubmit={handleUpdateGalleryItem}>
                  <div className="form-group">
                    <label htmlFor="editGalleryImageURL" className="form-label">Image URL:</label>
                    <input
                      type="url"
                      id="editGalleryImageURL"
                      className="event-input"
                      placeholder="Image URL"
                      value={editingGalleryItem.image}
                      onChange={(e) => setEditingGalleryItem({ ...editingGalleryItem, image: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="editImageCaption" className="form-label">Caption (Optional):</label>
                    <textarea
                      id="editImageCaption"
                      className="event-textarea"
                      placeholder="A brief caption for the image"
                      value={editingGalleryItem.caption}
                      onChange={(e) => setEditingGalleryItem({ ...editingGalleryItem, caption: e.target.value })}
                    ></textarea>
                  </div>
                  <div className="form-group">
                    <label htmlFor="editImageTags" className="form-label">Tags (comma-separated, Optional):</label>
                    <input
                      type="text"
                      id="editImageTags"
                      className="event-input"
                      placeholder="e.g., event, project, team"
                      value={editingGalleryItem.tags}
                      onChange={(e) => setEditingGalleryItem({ ...editingGalleryItem, tags: e.target.value })}
                    />
                  </div>
                  <div className="event-item-actions">
                    <button type="submit" className="event-button add-button">Save Changes</button>
                    <button type="button" className="event-button remove-button" onClick={() => setEditingGalleryItem(null)}>Cancel</button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
