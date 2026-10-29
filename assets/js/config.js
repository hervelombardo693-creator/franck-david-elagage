/*
 * ============================================================
 *  CONFIGURATION DU SITE — à personnaliser avec Franck David
 * ============================================================
 *  Laisser une valeur vide ('') tant qu'elle n'est pas confirmée :
 *  l'information correspondante reste alors masquée sur le site.
 *  Ne jamais saisir de coordonnées ou de données non vérifiées.
 */
window.SITE_CONFIG = {
  name: 'Franck David',
  activity: 'Élagueur',
  department: 'Puy-de-Dôme',
  region: 'Auvergne, France',

  // Coordonnées (non renseignées pour l'instant)
  email: '',          // ex. 'contact@exemple.fr' — active le lien e-mail et le formulaire
  phone: '',          // ex. '06 00 00 00 00' — active le lien d'appel
  commune: '',        // commune principale, ex. 'Clermont-Ferrand'
  hours: '',          // ex. 'Du lundi au vendredi, 8 h – 18 h'

  // Prestations affichées : passer à false celles que Franck ne propose pas.
  // Elles sont alors retirées de la page et de la liste du formulaire.
  services: {
    elagage: true,    // à confirmer
    taille: true,     // à confirmer
    abattage: true,   // à confirmer
    branches: true    // à confirmer
  }
};
