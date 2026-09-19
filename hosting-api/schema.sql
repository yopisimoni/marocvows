CREATE DATABASE IF NOT EXISTS marocvows CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE marocvows;

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  email VARCHAR(254) NOT NULL,
  language VARCHAR(8) NOT NULL DEFAULT 'fr',
  source VARCHAR(100) NOT NULL DEFAULT 'website',
  status ENUM('subscribed','unsubscribed') NOT NULL DEFAULT 'subscribed',
  consent_at DATETIME NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_newsletter_email (email),
  KEY idx_newsletter_status (status),
  KEY idx_newsletter_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS contact_events (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  provider_slug VARCHAR(180) NOT NULL,
  action ENUM('profile_view','call','whatsapp','email','website','map') NOT NULL,
  city VARCHAR(80) DEFAULT NULL,
  category VARCHAR(80) DEFAULT NULL,
  page_path VARCHAR(500) DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_contact_provider (provider_slug),
  KEY idx_contact_action (action),
  KEY idx_contact_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS provider_enquiries (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  provider_slug VARCHAR(180) DEFAULT NULL,
  name VARCHAR(150) DEFAULT NULL,
  email VARCHAR(254) DEFAULT NULL,
  phone VARCHAR(40) DEFAULT NULL,
  event_city VARCHAR(100) DEFAULT NULL,
  event_date DATE DEFAULT NULL,
  guest_count INT UNSIGNED DEFAULT NULL,
  message TEXT DEFAULT NULL,
  consent_at DATETIME NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_enquiry_provider (provider_slug),
  KEY idx_enquiry_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS provider_applications (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  business_name VARCHAR(180) NOT NULL,
  category VARCHAR(80) NOT NULL,
  city VARCHAR(100) NOT NULL,
  phone VARCHAR(40) DEFAULT NULL,
  whatsapp VARCHAR(40) DEFAULT NULL,
  email VARCHAR(254) DEFAULT NULL,
  website VARCHAR(500) DEFAULT NULL,
  description TEXT DEFAULT NULL,
  status ENUM('new','reviewing','approved','rejected') NOT NULL DEFAULT 'new',
  consent_at DATETIME NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_application_status (status),
  KEY idx_application_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;