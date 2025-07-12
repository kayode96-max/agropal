import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Badge,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  AccountCircle,
  Logout,
  Agriculture,
  Forum,
  WbSunny,
  School,
  RecordVoiceOver,
  Home,
  Camera,
  Flag,
  Schedule,
  AttachMoney,
  Notifications,
  Person,
} from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";

const Navbar: React.FC = () => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { user, logout } = useAuth();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
  };

  const navigationItems = [
    { path: "/", label: "Home", icon: <Home /> },
    { path: "/dashboard", label: "Dashboard", icon: <Agriculture /> },
    { path: "/diagnosis", label: "Crop Diagnosis", icon: <Camera /> },
    { path: "/community", label: "Community", icon: <Forum /> },
    { path: "/weather", label: "Weather", icon: <WbSunny /> },
    { path: "/learning", label: "Learning", icon: <School /> },
    { path: "/voice-chat", label: "Voice Chat", icon: <RecordVoiceOver /> },
    { path: "/calendar", label: "Calendar", icon: <Schedule /> },
    { path: "/market", label: "Market", icon: <AttachMoney /> },
  ];

  const renderNavItems = () => (
    <>
      {navigationItems.map((item) => (
        <Button
          key={item.path}
          component={Link}
          to={item.path}
          color="inherit"
          startIcon={item.icon}
          sx={{
            mx: 0.5,
            backgroundColor:
              location.pathname === item.path
                ? "rgba(255, 255, 255, 0.1)"
                : "transparent",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          {item.label}
        </Button>
      ))}
    </>
  );

  const renderMobileNavItems = () => (
    <List>
      {navigationItems.map((item) => (
        <ListItem
          key={item.path}
          component={Link}
          to={item.path}
          onClick={() => setMobileMenuOpen(false)}
          sx={{
            backgroundColor:
              location.pathname === item.path
                ? "action.selected"
                : "transparent",
          }}
        >
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.label} />
        </ListItem>
      ))}
    </List>
  );

  return (
    <>
      <AppBar position="sticky" elevation={2}>
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setMobileMenuOpen(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Box
            component={Link}
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              color: "inherit",
              flexGrow: isMobile ? 1 : 0,
            }}
          >
            <Agriculture sx={{ mr: 1 }} />
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: "bold",
                color: "white",
              }}
            >
              🌱 Agropal
            </Typography>
            <Chip
              icon={<Flag />}
              label="Nigeria"
              size="small"
              sx={{
                ml: 1,
                bgcolor: "rgba(255, 255, 255, 0.2)",
                color: "white",
                fontSize: "0.7rem",
                height: 24,
              }}
            />
          </Box>

          {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", ml: "auto" }}>
              {renderNavItems()}
            </Box>
          )}

          {user && (
            <Box sx={{ ml: 2, display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton
                size="large"
                color="inherit"
                component={Link}
                to="/notifications"
              >
                <Badge badgeContent={0} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
              <IconButton
                size="large"
                edge="end"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <Avatar
                  sx={{ width: 32, height: 32, bgcolor: "secondary.main" }}
                >
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem disabled>
                  <AccountCircle sx={{ mr: 1 }} />
                  {user.name || user.email}
                </MenuItem>
                <MenuItem disabled>
                  <Typography variant="body2" color="text.secondary">
                    Nigeria
                  </Typography>
                </MenuItem>
                <Divider />
                <MenuItem
                  component={Link}
                  to="/profile"
                  onClick={handleMenuClose}
                >
                  <Person sx={{ mr: 1 }} />
                  Profile
                </MenuItem>
                <MenuItem
                  component={Link}
                  to="/notifications"
                  onClick={handleMenuClose}
                >
                  <Notifications sx={{ mr: 1 }} />
                  Notifications
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <Logout sx={{ mr: 1 }} />
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      >
        <Box sx={{ width: 250 }}>
          <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
            <IconButton onClick={() => setMobileMenuOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider />
          {renderMobileNavItems()}
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
