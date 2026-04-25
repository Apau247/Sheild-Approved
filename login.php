<?php
/**
 * Iron Vault Security — Secure Vault Login
 * Self-processing login page with demo authentication.
 */

session_start();

// Security: regenerate session ID on login to prevent fixation
if (!isset($_SESSION['initiated'])) {
    session_regenerate_id(true);
    $_SESSION['initiated'] = true;
}

// CSRF token generation
if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

// Demo user database (in production this would query a database)
$users = [
    'secure@ironvaultsecurity.co.uk' => [
        'password_hash' => password_hash('VaultAccess2025!', PASSWORD_DEFAULT),
        'name'          => 'Vault Administrator',
        'role'          => 'admin'
    ],
    'client@ironvaultsecurity.co.uk' => [
        'password_hash' => password_hash('ClientSecure99', PASSWORD_DEFAULT),
        'name'          => 'Valued Client',
        'role'          => 'client'
    ]
];

$errors = [];
$success = false;
$loggedInUser = null;

// Handle logout
if (isset($_GET['logout'])) {
    session_destroy();
    header('Location: login.php');
    exit;
}

// Check existing session
if (!empty($_SESSION['user_email']) && !empty($_SESSION['user_role'])) {
    $loggedInUser = [
        'email' => $_SESSION['user_email'],
        'name'  => $_SESSION['user_name'] ?? 'Vault User',
        'role'  => $_SESSION['user_role']
    ];
}

// Handle POST login
if ($_SERVER['REQUEST_METHOD'] === 'POST' && !$loggedInUser) {
    $email    = isset($_POST['email']) ? trim($_POST['email']) : '';
    $password = isset($_POST['password']) ? $_POST['password'] : '';
    $remember = isset($_POST['remember']) ? true : false;
    $csrf     = isset($_POST['csrf_token']) ? $_POST['csrf_token'] : '';

    // CSRF validation
    if (!hash_equals($_SESSION['csrf_token'], $csrf)) {
        $errors[] = 'Invalid security token. Please refresh the page and try again.';
    }

    // Basic validation
    if (empty($errors)) {
        if (empty($email)) {
            $errors[] = 'Please enter your email address.';
        } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors[] = 'Please enter a valid email address.';
        }

        if (empty($password)) {
            $errors[] = 'Please enter your password.';
        }
    }

    // Authentication
    if (empty($errors)) {
        $authenticated = false;
        foreach ($users as $userEmail => $userData) {
            if (strtolower($userEmail) === strtolower($email)) {
                if (password_verify($password, $userData['password_hash'])) {
                    $authenticated = true;
                    $_SESSION['user_email'] = $userEmail;
                    $_SESSION['user_name']  = $userData['name'];
                    $_SESSION['user_role']  = $userData['role'];
                    $_SESSION['login_time'] = time();

                    if ($remember) {
                        // Secure remember-me cookie (30 days)
                        setcookie('ivs_remember', hash('sha256', $userEmail . $_SESSION['csrf_token']), [
                            'expires'  => time() + 2592000,
                            'path'     => '/',
                            'secure'   => true,
                            'httponly' => true,
                            'samesite' => 'Strict'
                        ]);
                    }

                    $loggedInUser = [
                        'email' => $userEmail,
                        'name'  => $userData['name'],
                        'role'  => $userData['role']
                    ];
                    $success = true;
                    break;
                }
            }
        }

        if (!$authenticated) {
            $errors[] = 'Invalid email or password. Please try again.';
            // Generic error to prevent user enumeration
        }
    }

    // Regenerate CSRF token after use
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Secure Vault Login — Iron Vault Security</title>
    <meta name="description" content="Secure client vault login for Iron Vault Security. Access your private vault storage account.">

    <!-- Favicon -->
    <link rel="icon" type="image/png" sizes="32x32" href="images/logo.png">
    <link rel="icon" type="image/png" sizes="192x192" href="images/logo.png">

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Arimo:wght@400;700&family=Archivo+Black&display=swap" rel="stylesheet">

    <!-- Stylesheets -->
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/__colors_default.css">
    <link rel="stylesheet" href="css/__colors_dark.css">
    <link rel="stylesheet" href="css/__custom.css">
    <link rel="stylesheet" href="css/responsive.css">
</head>
<body class="scheme_dark">

    <!-- 1. Header -->
    <header class="site-header">
        <div class="top-bar">
            <div class="container">
                <div class="top-bar-left">
                    <span>Contact Us Via <a href="tel:+442079460958">+44 20 7946 0958</a></span>
                </div>
                <div class="top-bar-right">
                    <?php if ($loggedInUser): ?>
                        <a href="login.php?logout=1" class="btn-secure-vault">Logout</a>
                    <?php else: ?>
                        <a href="login.php" class="btn-secure-vault">Secure Vault</a>
                    <?php endif; ?>
                </div>
            </div>
        </div>
        <div class="main-nav" id="mainNav">
            <div class="container">
                <a href="index.html" class="logo">
                    <img src="images/logo.png" alt="Iron Vault Security" width="258" height="57">
                </a>
                <div class="nav-actions">
                    <button class="search-toggle" aria-label="Open search">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </button>
                    <button class="menu-toggle" aria-label="Open menu" id="menuToggle">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </div>
        </div>
    </header>

    <!-- 2. Mobile Menu Overlay -->
    <div class="mobile-menu-overlay" id="mobileMenu">
        <div class="mobile-menu-content">
            <button class="menu-close" aria-label="Close menu" id="menuClose">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
            <a href="index.html" class="mobile-logo">
                <img src="images/logo.png" alt="Iron Vault Security" width="230" height="51">
            </a>
            <nav class="mobile-nav">
                <a href="login.php">Secure Vault</a>
                <a href="index.html#about">About Us</a>
                <a href="index.html#services">Services</a>
                <a href="index.html#contact">Contact Us</a>
            </nav>
            <form class="mobile-search" action="/search" method="get">
                <input type="text" name="s" placeholder="Search..." aria-label="Search">
                <button type="submit">Search</button>
            </form>
        </div>
    </div>

    <!-- Search Overlay -->
    <div class="search-overlay" id="searchOverlay">
        <button class="search-close" aria-label="Close search" id="searchClose">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>
        <form class="search-form" action="/search" method="get">
            <input type="text" name="s" placeholder="Type to search..." aria-label="Search">
        </form>
    </div>

    <!-- Auth Section -->
    <section class="auth-section">
        <div class="auth-bg" style="background-image: url('images/hero5.jpg');"></div>
        <div class="auth-container">

            <?php if ($success && $loggedInUser): ?>
                <!-- Dashboard Welcome -->
                <div class="auth-card auth-dashboard">
                    <div class="auth-logo">
                        <img src="images/logo.png" alt="Iron Vault Security" width="180" height="40">
                    </div>
                    <div class="dashboard-welcome">
                        <div class="dashboard-icon">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                        </div>
                        <h1>Welcome, <?php echo htmlspecialchars($loggedInUser['name'], ENT_QUOTES, 'UTF-8'); ?></h1>
                        <p class="dashboard-role"><?php echo ucfirst(htmlspecialchars($loggedInUser['role'], ENT_QUOTES, 'UTF-8')); ?> Access</p>

                        <div class="dashboard-stats">
                            <div class="dash-stat">
                                <span class="dash-stat-value">2</span>
                                <span class="dash-stat-label">Active Vaults</span>
                            </div>
                            <div class="dash-stat">
                                <span class="dash-stat-value">12</span>
                                <span class="dash-stat-label">Stored Assets</span>
                            </div>
                            <div class="dash-stat">
                                <span class="dash-stat-value">0</span>
                                <span class="dash-stat-label">Pending Alerts</span>
                            </div>
                        </div>

                        <div class="dashboard-actions">
                            <a href="#" class="btn btn-full">View Vault Inventory</a>
                            <a href="#" class="btn btn-simple btn-full">Access Logs</a>
                            <a href="login.php?logout=1" class="btn btn-logout btn-full">Secure Logout</a>
                        </div>

                        <div class="dashboard-security">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                            </svg>
                            <span>Session secured with 256-bit encryption</span>
                        </div>
                    </div>
                </div>

            <?php else: ?>
                <!-- Login Form -->
                <div class="auth-card">
                    <div class="auth-logo">
                        <img src="images/logo.png" alt="Iron Vault Security" width="180" height="40">
                    </div>
                    <h1>Secure Vault Access</h1>
                    <p class="auth-subtitle">Enter your credentials to access your private vault.</p>

                    <?php if (!empty($errors)): ?>
                        <div class="alert alert-error">
                            <?php foreach ($errors as $error): ?>
                                <p><?php echo htmlspecialchars($error, ENT_QUOTES, 'UTF-8'); ?></p>
                            <?php endforeach; ?>
                        </div>
                    <?php endif; ?>

                    <form class="auth-form" action="login.php" method="post" novalidate>
                        <input type="hidden" name="csrf_token" value="<?php echo htmlspecialchars($_SESSION['csrf_token'], ENT_QUOTES, 'UTF-8'); ?>">

                        <div class="form-field">
                            <label for="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                class="auth-input"
                                placeholder="Enter your email"
                                required
                                autocomplete="email"
                                value="<?php echo isset($_POST['email']) ? htmlspecialchars($_POST['email'], ENT_QUOTES, 'UTF-8') : ''; ?>"
                                aria-label="Email Address"
                            >
                        </div>

                        <div class="form-field">
                            <label for="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                class="auth-input"
                                placeholder="Enter your password"
                                required
                                autocomplete="current-password"
                                aria-label="Password"
                            >
                        </div>

                        <div class="form-field auth-options">
                            <label class="checkbox-field remember-field">
                                <input type="checkbox" name="remember" id="remember">
                                <span>Remember this device for 30 days</span>
                            </label>
                            <a href="#" class="auth-link">Forgot password?</a>
                        </div>

                        <button type="submit" class="btn btn-submit btn-full">Access Vault</button>
                    </form>

                    <div class="auth-divider">
                        <span>Demo Access</span>
                    </div>

                    <div class="demo-credentials">
                        <p><strong>Admin:</strong> secure@ironvaultsecurity.co.uk / VaultAccess2025!</p>
                        <p><strong>Client:</strong> client@ironvaultsecurity.co.uk / ClientSecure99</p>
                    </div>

                    <div class="auth-footer">
                        <p>Need a vault? <a href="index.html#contact" class="auth-link">Contact our team</a></p>
                    </div>
                </div>
            <?php endif; ?>
        </div>
    </section>

    <!-- 13. Footer -->
    <footer class="site-footer">
        <div class="container">
            <div class="footer-grid">
                <div class="footer-col footer-logo">
                    <img src="images/logo.png" alt="Iron Vault Security" width="230" height="51">
                </div>
                <div class="footer-col">
                    <h4>Company info</h4>
                    <nav>
                        <a href="index.html#about">About page</a>
                    </nav>
                </div>
                <div class="footer-col">
                    <h4>Our services</h4>
                    <nav>
                        <a href="index.html#services">Services page</a>
                    </nav>
                </div>
                <div class="footer-col footer-cta">
                    <?php if ($loggedInUser): ?>
                        <a href="login.php?logout=1" class="btn btn-simple">Logout</a>
                    <?php else: ?>
                        <a href="login.php" class="btn btn-simple">Secure Vault</a>
                    <?php endif; ?>
                    <div class="social-icons">
                        <a href="#" aria-label="Facebook"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg></a>
                        <a href="#" aria-label="Twitter"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg></a>
                        <a href="#" aria-label="LinkedIn"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg></a>
                    </div>
                </div>
            </div>
            <div class="copyright-bar">
                <p>Iron Vault Security &copy; <?php echo date('Y'); ?>. All Rights Reserved.</p>
            </div>
        </div>
    </footer>

    <script src="js/__scripts.js"></script>
</body>
</html>

