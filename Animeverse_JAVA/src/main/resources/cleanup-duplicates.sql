DELETE FROM readlist r1
WHERE r1.readlist_id NOT IN (
    SELECT MIN(r2.readlist_id)
    FROM readlist r2
    GROUP BY r2.utente_id, r2.manga_id
);

DELETE FROM watchlist w1
WHERE w1.watchlist_id NOT IN (
    SELECT MIN(w2.watchlist_id)
    FROM watchlist w2
    GROUP BY w2.utente_id, w2.anime_id
);
