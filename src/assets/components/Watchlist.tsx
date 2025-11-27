import { useState, useEffect } from 'react';
import './Watchlist.css';
import { Link, useNavigate } from 'react-router-dom';
import { useWatchlist } from '../hooks/useWatchlist';
import { useReadlist } from '../hooks/useReadlist';
import { useAuth } from '../hooks/useAuthContext';
import { API_BASE } from '../services/api';

// Default image for fallback (using a reliable placeholder service)
const DEFAULT_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMzAwIiB2aWV3Qm94PSIwIDAgMjAwIDMwMCIgZmlsbD0iI2VlZSI+CiAgPHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNlZWVlZWUiLz4KICA8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBhbGlnbm1lbnQtYmFzZWxpbmU9Im1pZGRsZSIgZmlsbD0iIzk5OSI+Tm8gSW1hZ2U8L3RleHQ+Cjwvc3ZnPg==';

// Base item properties that are common to all list items
interface BaseListItem {
  id: number;
  title?: string;
  image?: string;
  status: 'watching' | 'completed' | 'on-hold' | 'planning' | 'dropped';
  score?: number;
  progress?: number;
  type?: 'anime' | 'manga';
  synopsis?: string;
  year?: number;
  episodes?: number;
  totalEpisodes?: number;
  chapters?: number;
  volumes?: number;
  animeId?: number;
  mangaId?: number;
  animeTitolo?: string;
  images?: {
    jpg?: { image_url?: string; large_image_url?: string };
    webp?: { image_url?: string; large_image_url?: string };
  };
  imageUrl?: string;
}

interface AnimeListItem extends BaseListItem {
  animeId?: number;
  anime?: {
    id: number;
    title: string;
    imageUrl?: string;
    episodes?: number;
    score?: number;
    year?: number;
    synopsis?: string;
    images?: {
      jpg?: { image_url?: string; large_image_url?: string };
      webp?: { image_url?: string; large_image_url?: string };
    };
  };
  episodes?: number;
  totalEpisodes?: number;
}

interface MangaListItem extends BaseListItem {
  mangaId?: number;
  manga?: {
    id: number;
    title: string;
    imageUrl?: string;
    chapters?: number;
    volumes?: number;
    score?: number;
    year?: number;
    synopsis?: string;
    images?: {
      jpg?: { image_url?: string; large_image_url?: string };
      webp?: { image_url?: string; large_image_url?: string };
    };
  };
  chapters?: number;
  volumes?: number;
}

type UnknownItem = Partial<AnimeListItem & MangaListItem>;

// Type guard to check if an item is an AnimeListItem
function isAnimeItem(item: BaseListItem): item is AnimeListItem {
  return 'progress' in item || 'totalEpisodes' in item || 'anime' in item || 'animeTitolo' in item;
}

// Type guard to check if an item is a MangaListItem
function isMangaItem(item: BaseListItem): item is MangaListItem {
  return 'chapters' in item || 'volumes' in item || 'manga' in item || 'mangaId' in item;
}

interface AnimeListItem extends MediaItem {
  type?: 'anime';
  progress?: number;
  totalEpisodes?: number;
  episodes?: number;
  animeId?: number;
  anime?: {
    id?: number;
    title?: string;
    episodes?: number;
    imageUrl?: string;
    images?: {
      jpg?: {
        image_url?: string;
        large_image_url?: string;
      };
      webp?: {
        image_url?: string;
        large_image_url?: string;
      };
    };
    score?: number;
  };
  animeTitolo?: string;
}

interface MangaListItem extends MediaItem {
  type?: 'manga';
  chapters?: number;
  volumes?: number;
  mangaId?: number;
  manga?: {
    id?: number;
    title?: string;
    chapters?: number;
    volumes?: number;
    imageUrl?: string;
    score?: number;
    synopsis?: string;
    year?: number;
  };
}

// This type is used as a union of both anime and manga item types
// This type is used as a union of all possible item types
export type ListItem = AnimeListItem | MangaListItem | UnknownItem;

export default function Watchlist() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { 
    watchlist: animeList, 
    removeFromWatchlist, 
    loading, 
    error 
  } = useWatchlist();
  const { readlist: mangaList, removeFromReadlist } = useReadlist();
  
  // Function to handle navigation to item details
  const handleItemClick = (item: AnimeListItem | MangaListItem | UnknownItem, e: React.MouseEvent) => {
    // Don't navigate if clicking on action buttons, links, or status dropdown
    if (
      (e.target as HTMLElement).closest('.av-btn--danger') || 
      (e.target as HTMLElement).closest('.av-status-dropdown') ||
      (e.target as HTMLElement).tagName === 'A' ||
      (e.target as HTMLElement).tagName === 'BUTTON' ||
      (e.target as HTMLElement).closest('button') ||
      (e.target as HTMLElement).closest('a')
    ) {
      return;
    }
    
    console.log('Navigating to item details:', item);
    
    const isManga = activeTab === 'manga';
    const title = item.title || (isManga ? 'Manga Senza Titolo' : 'Anime Senza Titolo');
    
    const itemId = isManga 
      ? (item as MangaListItem).mangaId || item.id 
      : (item as AnimeListItem).animeId || item.id;
    
    const itemData = {
      ...item,
      id: itemId,
      title: title,
      type: isManga ? 'manga' : 'anime'
    };
    
    const path = `/${isManga ? 'manga' : 'anime'}/${itemId}`;
    console.log(`Navigating to: ${path}`, { itemData });
    
    navigate(path, { 
      state: { 
        item: itemData,
        fromList: true
      },
      replace: false
    });
  };
  const [activeTab, setActiveTab] = useState<'anime' | 'manga'>('anime');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  // Log the current watchlist data for debugging
  useEffect(() => {
    console.log('Current watchlist data:', animeList);
    console.log('Manga list data:', mangaList);
    
    if (animeList.length > 0) {
      console.log('First anime item structure:', JSON.stringify(animeList[0], null, 2));
      console.log('First anime ID:', animeList[0].id, 
                 'Anime ID:', (animeList[0] as AnimeListItem).animeId, 
                 'Nested ID:', (animeList[0] as AnimeListItem).anime?.id,
                 'Title:', animeList[0].title);
    }
    
    if (mangaList.length > 0) {
      console.log('First manga item structure:', JSON.stringify(mangaList[0], null, 2));
      console.log('First manga ID:', mangaList[0].id, 
                 'Manga ID:', (mangaList[0] as MangaListItem).mangaId, 
                 'Nested ID:', (mangaList[0] as MangaListItem).manga?.id,
                 'Title:', mangaList[0].title);
    }
  }, [animeList, mangaList]);

  const currentList = activeTab === 'anime' 
    ? (animeList as AnimeListItem[]) 
    : (mangaList as MangaListItem[]);

  // Function to safely get image URL with proper error handling and URL validation
  const getImageUrl = (item: AnimeListItem | MangaListItem): string => {
    try {
      // If it's already a data URI, return it as is
      if (item.image?.startsWith('data:')) {
        return item.image;
      }
      
      // If it's a full URL, return it as is
      if (item.image?.startsWith('http')) {
        return item.image;
      }
      
      // If it's a relative path, prepend API_BASE
      if (item.image) {
        return `${API_BASE}${item.image.startsWith('/') ? '' : '/'}${item.image}`;
      }
      
      // Handle anime items
      if (isAnimeItem(item)) {
        // Try anime.imageUrl
        if (item.anime?.imageUrl) {
          return item.anime.imageUrl.startsWith('http')
            ? item.anime.imageUrl
            : `${API_BASE}${item.anime.imageUrl.startsWith('/') ? '' : '/'}${item.anime.imageUrl}`;
        }
        
        // Try anime.images
        if (item.anime?.images) {
          const images = item.anime.images;
          const imageUrl = images.jpg?.image_url || 
                          images.webp?.image_url || 
                          images.jpg?.large_image_url || 
                          images.webp?.large_image_url;
          
          if (imageUrl) {
            return imageUrl.startsWith('http') 
              ? imageUrl 
              : `${API_BASE}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
          }
        }
        
        // Try to get image from the root of the item
        if (item.imageUrl) {
          return item.imageUrl.startsWith('http')
            ? item.imageUrl
            : `${API_BASE}${item.imageUrl.startsWith('/') ? '' : '/'}${item.imageUrl}`;
        }
      }
      
      // Handle manga items
      if (isMangaItem(item)) {
        if (item.manga?.imageUrl) {
          return item.manga.imageUrl.startsWith('http')
            ? item.manga.imageUrl
            : `${API_BASE}${item.manga.imageUrl.startsWith('/') ? '' : '/'}${item.manga.imageUrl}`;
        }
        
        if (item.imageUrl) {
          return item.imageUrl.startsWith('http')
            ? item.imageUrl
            : `${API_BASE}${item.imageUrl.startsWith('/') ? '' : '/'}${item.imageUrl}`;
        }
      }
      
      // If no valid image found, return default
      return DEFAULT_IMAGE;
    } catch (error) {
      console.error('Error getting image URL:', error, 'Item:', item);
      return DEFAULT_IMAGE;
    }
  };

  const filteredItems = currentList
    .filter((item) => {
      if (filterStatus === 'all') return true;
      return item.status === filterStatus;
    })
    .sort((a, b) => b.id - a.id)
    .map((item: AnimeListItem | MangaListItem) => {
      // For anime items
      if (isAnimeItem(item)) {
        // Get the title from the most reliable source first
        const title = item.title || item.anime?.title || item.animeTitolo || 'Senza titolo';
        
        // Get image URL using the safe function
        const imageUrl = getImageUrl(item);
        
        // Get additional details
        const score = item.score || item.anime?.score;
        const episodes = item.totalEpisodes || item.episodes || item.anime?.episodes;
        const synopsis = item.synopsis || item.anime?.synopsis;
        const year = item.year || item.anime?.year;
        
        // Log the item data for debugging
        console.log('Anime item:', {
          id: item.id,
          title,
          imageUrl,
          status: item.status,
          progress: item.progress,
          totalEpisodes: episodes,
          score: score,
          year: year,
          synopsis: synopsis,
          rawItem: item // Include the raw item for debugging
        });
        
        return {
          ...item,
          title,
          image: imageUrl,
          score,
          episodes,
          synopsis,
          year,
          type: 'anime' as const,
          totalEpisodes: item.totalEpisodes || item.anime?.episodes || 0,
          progress: item.progress || 0,
          score: item.score || item.anime?.score,
          // Ensure we don't include manga-specific properties
          chapters: undefined,
          volumes: undefined,
          manga: undefined,
          mangaId: undefined
        };
      }
      
      // For manga items
      if (isMangaItem(item)) {
        const manga = item.manga || {};
        const title = manga.title || item.title || 'Senza titolo';
        let imageUrl = '';
        
        // Handle image URL
        if (manga.imageUrl) {
          imageUrl = manga.imageUrl.startsWith('http') 
            ? manga.imageUrl 
            : `${API_BASE}${manga.imageUrl}`;
        } else if (item.image) {
          imageUrl = item.image.startsWith('http')
            ? item.image
            : `${API_BASE}${item.image}`;
        } else {
          imageUrl = 'https://via.placeholder.com/200x300?text=No+Image';
        }
        
        return {
          ...item,
          title,
          image: imageUrl,
          type: 'manga' as const,
          chapters: manga.chapters ?? item.chapters,
          volumes: manga.volumes ?? item.volumes,
          synopsis: manga.synopsis || item.synopsis,
          year: manga.year || item.year,
          score: manga.score || item.score,
          // Ensure we don't include anime-specific properties
          progress: undefined,
          totalEpisodes: undefined,
          anime: undefined,
          animeId: undefined,
          animeTitolo: undefined
        };
      }
      
      // Fallback for items that don't match either type (shouldn't happen)
      console.warn('Item does not match anime or manga type:', item);
      return {
        id: 0,
        status: 'unknown',
        title: 'Sconosciuto',
        image: DEFAULT_IMAGE,
        type: 'unknown' as const,
        score: 0
      } as const;
    });

  const statusLabels: Record<string, string> = {
    watching: 'In corso',
    completed: 'Completato',
    'on-hold': 'In pausa',
    planning: 'Da guardare',
  };

  const statusIcons: Record<string, string> = {
    watching: 'bi-play-circle-fill',
    completed: 'bi-check-circle-fill',
    'on-hold': 'bi-pause-circle-fill',
    planning: 'bi-bookmark-fill',
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      watching: 'av-status--watching',
      completed: 'av-status--completed',
      'on-hold': 'av-status--on-hold',
      planning: 'av-status--planning',
    };
    return colors[status] || '';
  };

  return (
    <main className="av-watchlist-page">
      <div className="av-watchlist-container container">
        <section className="av-watchlist-header">
          <h1>{activeTab === 'anime' ? 'La mia Watchlist' : 'La mia Readlist'}</h1>
          <p>
            {activeTab === 'anime'
              ? 'Gestisci gli anime che stai guardando, hai completato o vuoi guardare'
              : 'Gestisci i manga che stai leggendo, hai completato o vuoi leggere'}
          </p>
        </section>

        <div className="av-watchlist-controls">
          <div className="av-tabs">
            <button
              className={`av-tab ${activeTab === 'anime' ? 'av-tab--active' : ''}`}
              onClick={() => setActiveTab('anime')}
            >
              <i className="bi bi-play-circle"></i> Anime
            </button>
            <button
              className={`av-tab ${activeTab === 'manga' ? 'av-tab--active' : ''}`}
              onClick={() => setActiveTab('manga')}
            >
              <i className="bi bi-book"></i> Manga
            </button>
          </div>

          <div className="av-filters">
            <select
              className="av-filter-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Tutti gli stati</option>
              <option value="watching">In corso</option>
              <option value="completed">Completato</option>
              <option value="on-hold">In pausa</option>
              <option value="planning">Da guardare</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="av-watchlist-loading">
            <i className="bi bi-arrow-repeat"></i>
            <p>Caricamento in corso...</p>
          </div>
        ) : error ? (
          <div className="av-watchlist-error">
            <i className="bi bi-exclamation-triangle"></i>
            <p>Si è verificato un errore nel caricamento della watchlist.</p>
            <p className="error-details">{error}</p>
            <button 
              className="av-btn av-btn--primary"
              onClick={() => window.location.reload()}
            >
              Ricarica
            </button>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="av-watchlist-empty">
            <i className="bi bi-inbox"></i>
            <h2>Nessun elemento</h2>
            <p>
              {activeTab === 'anime'
                ? 'Non hai ancora aggiunto anime alla tua watchlist'
                : 'Non hai ancora aggiunto manga alla tua readlist'}
            </p>
            <Link to={`/${activeTab}`} className="av-btn av-btn--primary">
              Scopri {activeTab === 'anime' ? 'Anime' : 'Manga'}
            </Link>
          </div>
        ) : (
          <div className="av-watchlist-grid">
            {filteredItems.map((item) => (
              <div 
                key={item.id} 
                className="av-watchlist-card"
                onClick={(e) => handleItemClick(item, e)}
              >
                <div className="av-watchlist-card__image">
                  <div className="av-watchlist-image-container">
                    <img 
                      src={item.image || DEFAULT_IMAGE} 
                      alt={item.title || 'Cover image'}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null; // Prevent infinite loop
                        target.src = DEFAULT_IMAGE;
                      }}
                      loading="lazy"
                    />
                  </div>
                  <div className={`av-status-badge ${getStatusColor(item.status)}`}>
                    <i className={`bi ${statusIcons[item.status]}`}></i>
                    <span>{statusLabels[item.status]}</span>
                  </div>
                  {item.score && (
                    <div className="av-score-badge">
                      <i className="bi bi-star-fill"></i>
                      <span>{item.score}</span>
                    </div>
                  )}
                </div>
                <div className="av-watchlist-card__content">
                  <h3 title={item.title}>
                    {item.title.length > 30 ? `${item.title.substring(0, 30)}...` : item.title}
                  </h3>
                  {activeTab === 'anime' && isAnimeItem(item) && item.progress !== undefined && item.totalEpisodes !== undefined && (
                    <div className="av-progress">
                      <div className="av-progress__bar">
                        <div
                          className="av-progress__fill"
                          style={{
                            width: `${Math.min(100, (item.progress / (item.totalEpisodes || 1)) * 100)}%`,
                          }}
                        ></div>
                      </div>
                      <span className="av-progress__text">
                        {item.progress}/{item.totalEpisodes || '?'}
                      </span>
                    </div>
                  )}
                  {activeTab === 'manga' && isMangaItem(item) && (item.chapters || item.volumes) && (
                    <div className="av-manga-progress">
                      {item.chapters && (
                        <div className="av-manga-progress__item">
                          <i className="bi bi-book"></i> {item.chapters} {item.chapters === 1 ? 'capitolo' : 'capitoli'}
                        </div>
                      )}
                      {item.volumes && (
                        <div className="av-manga-progress__item">
                          <i className="bi bi-collection"></i> {item.volumes} {item.volumes === 1 ? 'volume' : 'volumi'}
                        </div>
                      )}
                    </div>
                  )}
                  <div className="av-watchlist-card__actions">
                    <button
                      className="av-btn av-btn--small av-btn--outline av-btn--danger"
                      onClick={async (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        try {
                          if (activeTab === 'anime') {
                            if (token) await removeFromWatchlist(token, item.id);
                          } else {
                            if (token) await removeFromReadlist(token, item.id);
                          }
                        } catch (error) {
                          console.error('Error removing item:', error);
                        }
                      }}
                    >
                      <i className="bi bi-trash"></i> Rimuovi
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <section className="av-watchlist-stats">
          <h2>Statistiche</h2>
          <div className="av-stats-grid">
            <div className="av-stat-box">
              <span className="av-stat-label">In corso</span>
              <span className="av-stat-value">
                {currentList.filter((item) => item.status === 'watching').length}
              </span>
            </div>
            <div className="av-stat-box">
              <span className="av-stat-label">Completati</span>
              <span className="av-stat-value">
                {currentList.filter((item) => item.status === 'completed').length}
              </span>
            </div>
            <div className="av-stat-box">
              <span className="av-stat-label">In pausa</span>
              <span className="av-stat-value">
                {currentList.filter((item) => item.status === 'on-hold').length}
              </span>
            </div>
            <div className="av-stat-box">
              <span className="av-stat-label">Da guardare</span>
              <span className="av-stat-value">
                {currentList.filter((item) => item.status === 'planning').length}
              </span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
