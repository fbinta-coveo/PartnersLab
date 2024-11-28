export const InternationalizationEnabled = false;

export const DefaultLanguage = "en";

export const LanguagesConfig = {
    "en": "🇺🇸",
    "fr": "🇫🇷",
    "de": "🇩🇪",
}

// #region HomeConfig

// -----------------------  HomeConfig  -----------------------
// Encompasses Header Text, Hero Text, Main Recommendation Text & Video Recommendation Text

// For the following you don't need to define the property if you don't want to translate it.
// The few that have "title": {} are there as a reference point to what the object should look like.
// Although there is default text for each field on the UI, you can overwrite it here or in the file directly.
export const HomeHeaderConfigTranslations = {
    "serviceSupport": {
        "title": {
            "en": "Support Services",
            "fr": "Service Assistance",
            "de": "Support"
        }
    },
    "ecommerce": {
        "title": {
            "de": "Webshop"
        }
    },
    "workplace": {
        "title": {
            "de": "Intranat"
        }
    },
    "siteSearch": {
        "title": {
            "fr": "Recherche",
            "de": "Website-Suche"
        }
    },
    "aiLabs": {
        "title": {}
    },
    "coveoLife": {
        "title": {}
    }
}

export const HeroConfigTranslations = {
    "title": {
        "fr": "La seule plateforme d'intelligence artificielle spécialement conçue pour rendre chaque expérience numérique agréable, pertinente et rentable"
    },
    "description": {
        "fr": "Recherche Avancée. Recommandations pertinentes. Personnalisation inégalée"
    },
    "buttonText": {
        "fr": "Explorer",
        "de": "mehr erfahren"
    }
}

export const MainRecommendationConfigTranslations = {
    "title": {
        "fr": "Recommandations",
        "de": "Empfehlungen"

    },
    "description": {
        "fr": "Voici vos recommandations personnalisées",
        "de": "personalisierte Empfehlungen"
    }
}


export const VideoRecommendationConfigTranslations = {
    "title": {
        "fr": "Vidéos",
        "de": "Video"
    },
    "description": {
        "fr": "Voici vos recommandations personnalisées",
        "de": "personalisierte Video Empfehlungen"
    }
}

// #endregion

// #region SearchConfig

// -----------------------  SearchConfig  -----------------------
// Encompasses Default Text & Tab Text

// Only thing that changes here typically would be to add additional languages
export const SearchConfigTranslations = {
    "searchBarTitle": {
        "en": "What can we help you find?",
        "fr": "Que pouvons-nous vous aider à trouver?",
        "de": "Wie könnnen wir Ihnen helfen?"
    },
    "noResultsHeading": {
        "fr": "Résultats Populaires",
        "de": "beliebte Produkte"
    },
    "popularQueries": {
        "en": "Popular Queries",
        "de": "beliebte Suchen"
    },
    "featuredResults": {
        "en": "Featured Results",
        "de": "beliebte Produkte"
    },
    "moreResults": {
        "en": "More Results",
        "de": "weitere Ergebnisse"
    },
    "learnMore": {
        "en": "learn more",
        "de": "mehr erfahren"
    },
    "watchNow": {
        "en": "watch now",
        "de": "anschauen"
    },
    "recentQueries": {
        "fr": "Recherches Récentes",
        "de": "zuletzt gesucht"
    },
    "recentResults": {
        "en": "Recent Results",
        "de": "zuletzt angeschaut"
    },
    "smartSnippets": {
        "fr": "Snippet Intelligent",
        "de": "Smart Snippets"
    },
    "generativeAnswering": {
        "fr": "Réponse Générative",
        "en": "Generative Answering",
        "de": "Generative Antworten"
    }
}

/*
    SearchPageTabConfigTranslations
    -------------------------------

    Description: Used as a means of translating search tabs and their corresponding search bars.

    1. This field is conditional on the varying sources - You will most likely have to change the values in the config.
    2. If you aren't modifying a certain tab's translations, you can remove the inner object from the configuration (*2)

*/
export const SearchPageTabConfigTranslations = {
    "all": {
        "caption": {
            "fr": "Tout",
            "de": "Alle"
        }
    },
    "products": {
        "caption": {
            "en": "Products",
            "de": "Produkte"
        }
    },
    "eventsWebinars": {
        "caption": {
            "fr": "Événements & Webinaires"
        }
    },
    "resources": {
        "caption" : {
            "fr": "Ressources"
        }
    },
    "sharepoint": {

    },
    "blog": {

    },
    "newsroom": {
        "caption": {
            "fr": "Nouvelles"
        }
    },
    "supportTraining": {
        "caption": {
            "fr": "Assistance & Formation",
        },
    },
    "youtube": {
        "de" : "Videos"
    }
}

// #endregion

// #region Facets

// If you don't want to offer any value or label translations, you can omit the object all together
export const FacetTranslations = {
    "author": {
        "label": {
            "fr": "Auteur",
            "de": "Autor"
        }
    },
    "source": {
        "values": {
            "fr": {
                "Products": "Produits"
            }
        }
    },
    "category": {
        "label": {
            "fr": "Solutions de Plateforme",
            "de": "Kategorie"
        }
    },
    // Since concepts translates to concepts in French, in theory we don't need this object to be here at all.
    // So as an example of not requiring all the fields it will be commented out.
    // "concepts": {
    //     "label": {
    //         "fr": "Concepts"
    //     }
    // }
    //...
}

// #endregion

// #region CoveoStandardText

export const CoveoStandardTranslations = {
    "load-more-results": {
        "en": "Load More Content"
    },
    "search": {},
    "no-title": {},
    "search-ellipsis": {},
    "left": {},
    "right": {},
    "search-box": {},
    "search-box-with-suggestions": {},
    "search-box-with-suggestions-macos": {},
    "search-box-with-suggestions-keyboardless": {},
    "search-suggestions-single-list": {},
    "search-suggestions-double-list": {},
    "search-suggestion-single-list": {},
    "search-suggestion-double-list": {},
    "search-suggestion-button": {},
    "search-disabled": {},
    "query-suggestion-label": {},
    "recent-query-suggestion-label": {},
    "instant-results-suggestion-label": {},
    "facet-search-input": {},
    "facet-search": {},
    "facet-value": {},
    "facet-value_plural": {},
    "facet-value_other": {},
    "facet-value-exclude": {},
    "facet-value-exclude_plural": {},
    "facet-value-exclude_other": {},
    "remove-filter-on": {},
    "remove-exclusion-filter-on": {},
    "query-suggestion-list": {},
    "tab-search": {},
    "clear": {
        "de":"Alle Filter löschen"
    },
    "all-categories": {},
    "show-all-results": {},
    "show-more": {},
    "show-less": {},
    "show-less-facet-values": {},
    "show-more-facet-values": {},
    "facet-values": {},
    "facet-search-results": {},
    "facet-search-results-count": {},
    "facet-search-results-count_plural": {},
    "facet-search-results-count_other": {},
    "pagination": {},
    "next": {},
    "previous": {},
    "page-number": {},
    "no-values-found": {},
    "results-per-page": {},
    "sort": {},
    "filters": {},
    "sort-by": {},
    "relevance": {},
    "most-recent": {},
    "clear-filters": {},
    "clear-filters_plural": {},
    "clear-filters_other": {},
    "clear-filters-for-facet": {},
    "clear-filters-for-facet_plural": {},
    "clear-filters-for-facet_other": {},
    "collapse-facet": {},
    "expand-facet": {},
    "showing-results-of": {},
    "showing-results-of_plural": {},
    "showing-results-of_other": {},
    "showing-results-of-with-query": {},
    "showing-results-of-with-query_plural": {},
    "showing-results-of-with-query_other": {},
    "showing-results-of-load-more": {},
    "load-all-results": {},
    "collapse-results": {},
    "no-documents-related": {},
    "in-seconds": {},
    "in-seconds_plural": {},
    "in-seconds_other": {},
    "no-results-for": {},
    "no-results-for-did-you-mean": {},
    "showing-results-for": {},
    "search-instead-for": {},
    "search-tips": {},
    "no-results": {},
    "more-matches-for": {},
    "no-matches-found-for": {},
    "recent-searches": {},
    "clear-recent-searches": {},
    "cancel-last-action": {},
    "cancel": {},
    "check-spelling": {},
    "try-using-fewer-keywords": {},
    "select-fewer-filters": {},
    "author": {},
    "file-type": {},
    "language": {},
    "source": {},
    "printable-uri": {},
    "collapsed-uri-parts": {},
    "disconnected": {},
    "check-your-connection": {},
    "no-endpoints": {},
    "invalid-token": {},
    "add-sources": {},
    "coveo-online-help": {},
    "cannot-access": {},
    "something-went-wrong": {},
    "if-problem-persists": {},
    "more-info": {},
    "clear-all-filters": {},
    "n-more": {},
    "show-n-more-filters": {},
    "query-auto-corrected-to": {},
    "did-you-mean": {},
    "close": {},
    "no-label": {},
    "to": {},
    "min": {},
    "max": {},
    "apply": {},
    "yes": {},
    "no": {},
    "popover": {},
    "number-input-minimum": {},
    "number-input-maximum": {},
    "number-input-apply": {},
    "start": {},
    "date-input-start": {},
    "date-input-end": {},
    "date-input-apply": {},
    "past-minute": {},
    "past-minute_plural": {},
    "past-minute_other": {},
    "past-hour": {},
    "past-hour_plural": {},
    "past-hour_other": {},
    "past-day": {},
    "past-day_plural": {},
    "past-day_other": {},
    "past-week": {},
    "past-week_plural": {},
    "past-week_other": {},
    "past-month": {},
    "past-month_plural": {},
    "past-month_other": {},
    "past-quarter": {},
    "past-quarter_plural": {},
    "past-quarter_other": {},
    "past-year": {},
    "past-year_plural": {},
    "past-year_other": {},
    "next-minute": {},
    "next-minute_plural": {},
    "next-minute_other": {},
    "next-hour": {},
    "next-hour_plural": {},
    "next-hour_other": {},
    "next-day": {},
    "next-day_plural": {},
    "next-day_other": {},
    "next-week": {},
    "next-week_plural": {},
    "next-week_other": {},
    "next-month": {},
    "next-month_plural": {},
    "next-month_other": {},
    "next-quarter": {},
    "next-quarter_plural": {},
    "next-quarter_other": {},
    "next-year": {},
    "next-year_plural": {},
    "next-year_other": {},
    "in": {},
    "under": {},
    "preview-result": {},
    "sort-and-filter": {},
    "view-results": {},
    "organization-is-paused": {},
    "organization-will-resume": {},
    "rating": {},
    "and-up": {},
    "only": {},
    "loading-results": {},
    "query-suggestions-available": {},
    "query-suggestions-available_plural": {},
    "query-suggestions-available_other": {},
    "query-suggestions-unavailable": {},
    "stars": {},
    "stars_plural": {},
    "stars_other": {},
    "stars-only": {},
    "stars-range": {},
    "with-colon": {},
    "between-quotations": {},
    "between-parentheses": {},
    "notifications": {},
    "notification-n": {},
    "smart-snippet": {},
    "smart-snippet-source": {},
    "smart-snippet-feedback-inquiry": {},
    "smart-snippet-feedback-thanks": {},
    "smart-snippet-feedback-explain-why": {},
    "smart-snippet-feedback-select-reason": {},
    "details": {},
    "feedback-send": {},
    "smart-snippet-feedback-reason-does-not-answer": {},
    "smart-snippet-feedback-reason-partially-answers": {},
    "smart-snippet-feedback-reason-was-not-a-question": {},
    "smart-snippet-feedback-reason-other": {},
    "smart-snippet-people-also-ask": {},
    "edit-insight": {},
    "insight-history": {},
    "insight-related-cases": {},
    "full-search": {},
    "calendar-last-day": {},
    "calendar-same-day": {},
    "calendar-next-day": {},
    "calendar-next-week": {},
    "calendar-last-week": {},
    "approx_year": {},
    "approx_year_plural": {},
    "approx_year_other": {},
    "approx_month": {},
    "approx_month_plural": {},
    "approx_month_other": {},
    "approx_day": {},
    "day_plural": {},
    "day_other": {},
    "quickview": {},
    "keywords-highlight": {},
    "minimize": {},
    "quickview-add-word": {},
    "quickview-remove-word": {},
    "quickview-next": {},
    "quickview-previous": {},
    "quickview-toggle-navigation": {},
    "quickview-navigate-keywords": {},
    "quickview-loading": {},
    "quickview-loaded": {},
    "more": {},
    "tab-popover": {},
    "generating-answer": {},
    "answer-generated": {},
    "answer-could-not-be-generated": {},
    "generated-answer-hidden": {},
    "generated-answer-title": {},
    "generated-answer-toggle-on": {},
    "generated-answer-toggle-off": {},
    "this-answer-was-helpful": {},
    "this-answer-was-not-helpful": {},
    "generated-answer-loading": {},
    "retry": {},
    "retry-stream-message": {},
    "feedback": {},
    "generated-answer-feedback-instructions": {},
    "irrelevant": {},
    "not-accurate": {},
    "out-of-date": {},
    "harmful": {},
    "other": {},
    "add-details": {},
    "generated-answer-feedback-success": {},
    "modal-done": {},
    "steps": {},
    "steps-tooltip": {},
    "bullets": {},
    "bullets-tooltip": {},
    "summary": {},
    "rephrase": {},
    "citations": {},
    "copy-generated-answer": {},
    "generated-answer-copied": {},
    "failed-to-copy-generated-answer": {},
}

// #endregion
