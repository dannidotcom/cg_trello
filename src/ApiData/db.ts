import { IBoard } from "../Interfaces/Trello";
import { IProject } from "../Interfaces/IProject";
import { IUsers } from "../Interfaces/IUsers";

export const mockBoards: IBoard[] = [
  {
    id: 1,
    nom: "À FAIRE",
    carte: [
      {
        id: 101,
        title: "Mise en place CI/CD",
        labels: [
          { id: 1, color: "#FF6B6B", text: "Urgent", cartes_id: 101 },
          { id: 2, color: "#4ECDC4", text: "DevOps", cartes_id: 101 },
        ],
        date: "2026-07-20",
        tasks: [
          { id: 1001, copleted: false, text: "Configurer GitHub Actions" },
          { id: 1002, copleted: false, text: "Mettre en place les tests auto" },
          { id: 1003, copleted: false, text: "Déploiement automatique" },
        ],
        user: [{ id: 1, images: "Alphonse" }],
        description: "Automatiser l'intégration et le déploiement continu avec GitHub Actions"
      },
      {
        id: 102,
        title: "Refactoring module auth",
        labels: [
          { id: 3, color: "#FFE66D", text: "Tech Debt", cartes_id: 102 },
        ],
        date: "2026-07-25",
        tasks: [
          { id: 1004, copleted: false, text: "Extraire les services" },
          { id: 1005, copleted: false, text: "Ajouter les tests unitaires" },
        ],
        user: [{ id: 2, images: "Danny" }],
        description: "Nettoyage et amélioration du code du module d'authentification"
      },
      {
        id: 103,
        title: "Dashboard analytics",
        labels: [
          { id: 4, color: "#A66CFF", text: "Feature", cartes_id: 103 },
          { id: 5, color: "#FF6B6B", text: "Design", cartes_id: 103 },
        ],
        date: "2026-08-01",
        tasks: [
          { id: 1006, copleted: false, text: "Design des graphiques" },
          { id: 1007, copleted: false, text: "Intégration Chart.js" },
        ],
        user: [{ id: 3, images: "Justin" }],
        description: "Créer un tableau de bord avec des graphiques analytiques"
      },
    ],
  },
  {
    id: 2,
    nom: "EN COURS",
    carte: [
      {
        id: 201,
        title: "API de paiement Stripe",
        labels: [
          { id: 6, color: "#4ECDC4", text: "API", cartes_id: 201 },
          { id: 7, color: "#FF6B6B", text: "Urgent", cartes_id: 201 },
        ],
        date: "2026-07-18",
        tasks: [
          { id: 2001, copleted: true, text: "Intégration Stripe SDK" },
          { id: 2002, copleted: false, text: "Webhooks de notification" },
          { id: 2003, copleted: false, text: "Tests de paiement" },
        ],
        user: [{ id: 1, images: "Alphonse" }],
        description: "Intégration complète de l'API de paiement Stripe"
      },
      {
        id: 202,
        title: "Interface utilisateur mobile",
        labels: [
          { id: 8, color: "#A66CFF", text: "Frontend", cartes_id: 202 },
        ],
        date: "2026-07-22",
        tasks: [
          { id: 2004, copleted: true, text: "Maquette responsive" },
          { id: 2005, copleted: false, text: "Adaptation des composants" },
        ],
        user: [{ id: 2, images: "Danny" }],
        description: "Adapter l'interface pour les appareils mobiles"
      },
      {
        id: 203,
        title: "Système de notification",
        labels: [
          { id: 9, color: "#FFE66D", text: "Backend", cartes_id: 203 },
        ],
        date: "2026-07-28",
        tasks: [
          { id: 2006, copleted: false, text: "Notifications push" },
          { id: 2007, copleted: false, text: "Notifications email" },
        ],
        user: [{ id: 3, images: "Justin" }],
        description: "Implémenter un système de notifications en temps réel"
      },
      {
        id: 204,
        title: "Optimisation des performances",
        labels: [
          { id: 10, color: "#4ECDC4", text: "Optimisation", cartes_id: 204 },
        ],
        date: "2026-07-30",
        tasks: [
          { id: 2008, copleted: true, text: "Audit Lighthouse" },
          { id: 2009, copleted: false, text: "Lazy loading images" },
        ],
        user: [{ id: 1, images: "Alphonse" }],
        description: "Améliorer les performances et le score Lighthouse"
      },
    ],
  },
  {
    id: 3,
    nom: "EN REVUE",
    carte: [
      {
        id: 301,
        title: "Export PDF des rapports",
        labels: [
          { id: 11, color: "#A66CFF", text: "Feature", cartes_id: 301 },
        ],
        date: "2026-07-15",
        tasks: [
          { id: 3001, copleted: true, text: "Génération PDF" },
          { id: 3002, copleted: true, text: "Template rapport" },
          { id: 3003, copleted: false, text: "Téléchargement" },
        ],
        user: [{ id: 3, images: "Justin" }],
        description: "Génération de rapports PDF personnalisables"
      },
      {
        id: 302,
        title: "Gestion des rôles",
        labels: [
          { id: 12, color: "#FF6B6B", text: "Sécurité", cartes_id: 302 },
        ],
        date: "2026-07-19",
        tasks: [
          { id: 3004, copleted: true, text: "CRUD rôles" },
          { id: 3005, copleted: true, text: "Permissions" },
        ],
        user: [{ id: 2, images: "Danny" }],
        description: "Système de gestion des rôles et permissions"
      },
    ],
  },
  {
    id: 4,
    nom: "TERMINÉ",
    carte: [
      {
        id: 401,
        title: "Authentification JWT",
        labels: [
          { id: 13, color: "#4ECDC4", text: "Auth", cartes_id: 401 },
        ],
        date: "2026-06-30",
        tasks: [
          { id: 4001, copleted: true, text: "Login/Register" },
          { id: 4002, copleted: true, text: "Refresh token" },
          { id: 4003, copleted: true, text: "Password reset" },
        ],
        user: [{ id: 1, images: "Alphonse" }],
        description: "Système d'authentification complet avec JWT"
      },
      {
        id: 402,
        title: "Base de données PostgreSQL",
        labels: [
          { id: 14, color: "#FFE66D", text: "Infrastructure", cartes_id: 402 },
        ],
        date: "2026-06-25",
        tasks: [
          { id: 4004, copleted: true, text: "Schéma BDD" },
          { id: 4005, copleted: true, text: "Migrations" },
        ],
        user: [{ id: 3, images: "Justin" }],
        description: "Mise en place de la base de données PostgreSQL"
      },
      {
        id: 403,
        title: "Maquette UI/UX",
        labels: [
          { id: 15, color: "#A66CFF", text: "Design", cartes_id: 403 },
        ],
        date: "2026-06-20",
        tasks: [
          { id: 4006, copleted: true, text: "Wireframes" },
          { id: 4007, copleted: true, text: "Prototype Figma" },
        ],
        user: [{ id: 2, images: "Danny" }],
        description: "Conception de l'interface utilisateur complète"
      },
    ],
  },
];

export const mockUsers: IUsers[] = [
  { user_id: 1, user_username: "Alphonse Solofo", user_email: "alphonse@cg-group.com", user_photo: "" },
  { user_id: 2, user_username: "Danny RANDRIAMANGA", user_email: "danny@cg-group.com", user_photo: "" },
  { user_id: 3, user_username: "Justin RAMANANA", user_email: "justin@cg-group.com", user_photo: "" },
  { user_id: 4, user_username: "Marie Claire", user_email: "marie@cg-group.com", user_photo: "" },
  { user_id: 5, user_username: "Faly RAKOTO", user_email: "faly@cg-group.com", user_photo: "" },
];

export const mockProjects: IProject[] = [
  { project_id: 1, project_title: "CG Trello V2", project_type: "Nouvel fonctionnalité", project_description: "Refonte complète de l'interface", project_status: "EN COURS", project_bigindate: "2026-07-01", project_enddate: "2026-09-30" },
  { project_id: 2, project_title: "API REST", project_type: "Nouvel fonctionnalité", project_description: "Développement de l'API RESTful", project_status: "EN COURS", project_bigindate: "2026-06-15", project_enddate: "2026-08-15" },
  { project_id: 3, project_title: "Correction bugs auth", project_type: "Débogage", project_description: "Correction des bugs du module auth", project_status: "EN ATTENTE", project_bigindate: "2026-07-10", project_enddate: "2026-07-25" },
  { project_id: 4, project_title: "Mobile App", project_type: "Nouvel fonctionnalité", project_description: "Application mobile React Native", project_status: "EN COURS", project_bigindate: "2026-07-01", project_enddate: "2026-10-01" },
  { project_id: 5, project_title: "Déploiement AWS", project_type: "Débogage", project_description: "Migration vers AWS", project_status: "CLOTURER", project_bigindate: "2026-05-01", project_enddate: "2026-06-30" },
  { project_id: 6, project_title: "Système de logs", project_type: "Nouvel fonctionnalité", project_description: "ELK Stack pour les logs", project_status: "EN ATTENTE", project_bigindate: "2026-08-01", project_enddate: "2026-09-01" },
  { project_id: 7, project_title: "Chat temps réel", project_type: "Nouvel fonctionnalité", project_description: "Chat avec WebSocket", project_status: "EN COURS", project_bigindate: "2026-07-15", project_enddate: "2026-08-30" },
  { project_id: 8, project_title: "Sécurisation API", project_type: "Débogage", project_description: "Audit et sécurisation", project_status: "CLOTURER", project_bigindate: "2026-06-01", project_enddate: "2026-06-20" },
];

export const mockUsersSimple = [
  { id: 1, images: "Alphonse" },
  { id: 2, images: "Danny" },
  { id: 3, images: "Justin" },
];
