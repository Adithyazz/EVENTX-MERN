import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';
import {
  FaArrowRight, FaCalendarAlt, FaCheckCircle, FaMapMarkerAlt,
  FaSearch, FaShieldAlt, FaStar, FaTicketAlt, FaUsers,
  FaCity, FaSlidersH, FaHeart, FaMusic, FaLaptopCode, FaBriefcase,
  FaPalette, FaUtensils, FaRunning, FaGraduationCap
} from 'react-icons/fa';

const categoryIcons = {
  Music: FaMusic,
  Technology: FaLaptopCode,
  Business: FaBriefcase,
  Art: FaPalette,
  Food: FaUtensils,
  Sports: FaRunning,
  Workshops: FaGraduationCap,
};

const Home = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/events?search=${encodeURIComponent(search)}`);
        if (!cancelled) setEvents(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching events:', error);
        if (!cancelled) setEvents([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    const timer = setTimeout(load, 220);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [search]);

  const categories = useMemo(() => {
    const unique = [...new Set(events.map((event) => event.category).filter(Boolean))];
    return ['All', ...unique];
  }, [events]);

  const visibleEvents = useMemo(() => (
    activeCategory === 'All' ? events : events.filter((event) => event.category === activeCategory)
  ), [events, activeCategory]);

  const totalSeats = events.reduce((sum, event) => sum + Number(event.totalSeats || 0), 0);
  const availableSeats = events.reduce((sum, event) => sum + Number(event.availableSeats || 0), 0);

  const formatDate = (date) => new Date(date).toLocaleDateString(undefined, {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
  });

  const categoryList = categories.length > 1 ? categories : ['All', 'Music', 'Business', 'Technology', 'Art', 'Sports', 'Food', 'Workshops'];
  const heroImages = events.filter((event) => event.image).slice(0, 3);

  return (
    <div className="eventx-home">
      <section className="eventx-hero">
        <div className="hero-stars" />
        <div className="hero-glow glow-blue" />
        <div className="hero-glow glow-purple" />
        <div className="hero-inner">
          <div className="hero-copy">
            <div className="hero-kicker"><span /> ONE PLACE. <b>COUNTLESS EXPERIENCES.</b></div>
            <h1>Make your next<br /><span>moment memorable.</span></h1>
            <p>Discover amazing events, book your spot, and create unforgettable memories — all in one place.</p>

            <div className="eventx-search">
              <FaSearch />
              <input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setActiveCategory('All'); }}
                placeholder="Search events, categories, or locations..."
              />
              <button type="button" onClick={() => document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' })}>
                Search
              </button>
            </div>

            <div className="hero-chips">
              {['Concerts', 'Workshops', 'Tech', 'Business', 'Art', 'Sports', 'Food', 'More'].map((item) => (
                <button key={item} type="button" onClick={() => {
                  const match = categories.find((c) => c.toLowerCase().includes(item.toLowerCase().replace('tech', 'technology')));
                  if (match) setActiveCategory(match);
                  document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' });
                }}>
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="hero-art" aria-hidden="true">
            <div className="hero-card back-card">
              {heroImages[1] ? <img src={heroImages[1].image} alt="" /> : <div className="hero-placeholder purple" />}
            </div>
            <div className="hero-card main-card">
              {heroImages[0] ? <img src={heroImages[0].image} alt="" /> : <div className="hero-placeholder cyan" />}
              <div className="hero-card-overlay"><b>Good Events<br />Brighter People</b><span>↗</span></div>
            </div>
            <div className="hero-card side-card">
              {heroImages[2] ? <img src={heroImages[2].image} alt="" /> : <div className="hero-placeholder pink" />}
            </div>
            <div className="hero-script">Experiences<br /><span>Beyond Ordinary</span></div>
          </div>
        </div>
      </section>

      <section className="eventx-stats">
        <div><span className="stat-icon purple"><FaCalendarAlt /></span><strong>{events.length || 0}</strong><b>Live Events</b><small>Happening near you</small></div>
        <div><span className="stat-icon blue"><FaUsers /></span><strong>{totalSeats.toLocaleString()}</strong><b>Total Spots</b><small>Creating memories</small></div>
        <div><span className="stat-icon violet"><FaCity /></span><strong>{availableSeats.toLocaleString()}</strong><b>Spots Available</b><small>Ready to book</small></div>
        <div><span className="stat-icon green"><FaShieldAlt /></span><strong>100%</strong><b>Secure Booking</b><small>Your data is safe with us</small></div>
      </section>

      <section className="eventx-events" id="events">
        <div className="events-heading">
          <div>
            <span className="blue-kicker">TRENDING NOW</span>
            <h2>Upcoming Events</h2>
            <p>Find your next experience from a wide range of events.</p>
          </div>
          <span className="view-all-pill">{visibleEvents.length} experiences <FaArrowRight /></span>
        </div>

        <div className="eventx-category-row">
          {categoryList.map((category) => {
            const Icon = categoryIcons[category];
            return (
              <button key={category} type="button" className={activeCategory === category ? 'active' : ''} onClick={() => setActiveCategory(category)}>
                {Icon ? <Icon /> : <FaHeart />} {category}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="eventx-grid">{[1, 2, 3, 4].map((n) => <div className="eventx-skeleton" key={n} />)}</div>
        ) : visibleEvents.length === 0 ? (
          <div className="eventx-empty"><FaSearch /><h3>No events found</h3><p>Try another search or category.</p><button onClick={() => { setSearch(''); setActiveCategory('All'); }}>Show all events</button></div>
        ) : (
          <div className="eventx-grid">
            {visibleEvents.map((event, index) => {
              const percent = event.totalSeats ? Math.max(0, Math.min(100, (event.availableSeats / event.totalSeats) * 100)) : 0;
              return (
                <article className="eventx-card" key={event._id} style={{ '--delay': `${index * 70}ms` }}>
                  <Link to={`/events/${event._id}`} className="eventx-image">
                    {event.image ? <img src={event.image} alt={event.title} /> : <div className="event-fallback">{event.category || 'EVENT'}</div>}
                    <span className="event-price">{event.ticketPrice === 0 ? 'FREE' : `₹${event.ticketPrice}`}</span>
                  </Link>
                  <div className="eventx-card-body">
                    <div className="event-card-top"><span>{event.category || 'EVENT'}</span><b><FaStar /> 4.8</b></div>
                    <h3>{event.title}</h3>
                    <p><FaCalendarAlt /> {formatDate(event.date)}</p>
                    <p><FaMapMarkerAlt /> {event.location}</p>
                    <div className="availability"><span>{event.availableSeats} of {event.totalSeats} seats remaining</span><i><em style={{ width: `${percent}%` }} /></i></div>
                    <Link to={`/events/${event._id}`} className="eventx-button">View Details <FaArrowRight /></Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="eventx-features">
        <div><span>01</span><FaTicketAlt /><h3>Fast booking</h3><p>Reserve your place without unnecessary steps.</p></div>
        <div><span>02</span><FaHeart /><h3>Plans together</h3><p>Keep your events and tickets organized.</p></div>
        <div><span>03</span><FaShieldAlt /><h3>Secure by design</h3><p>Authentication and booking built with care.</p></div>
      </section>

      <section className="eventx-cta">
        <div className="cta-glow" />
        <span>VIVENTA / YOUR NEXT EXPERIENCE</span>
        <h2>There&apos;s always<br /><em>something happening.</em></h2>
        <p>Explore the calendar. Find your people. Make the plan.</p>
        <a href="#events">Explore events <FaArrowRight /></a>
      </section>

      <footer className="eventx-footer"><strong>EVENT<span>X</span></strong><p>Discover events worth showing up for.</p><small>© {new Date().getFullYear()} VIVENTA. All rights reserved.</small></footer>
    </div>
  );
};

export default Home;
