import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  styled,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { keyframes } from "@emotion/react";
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  AccountCircle,
  Person,
  Notifications,
  Logout,
  Home,
  Dashboard,
  CameraAlt,
  Forum,
  WbSunny,
  School,
  Mic,
  CalendarMonth,
  ShoppingCart,
  Settings,
} from "@mui/icons-material";

// Define animations
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const fadeInDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(76, 175, 80, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
  }
`;

// Styled components for the Navbar
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: `linear-gradient(145deg, ${alpha(theme.palette.background.default, 0.9)}, ${alpha(theme.palette.primary.dark, 0.2)})`,
  backdropFilter: "blur(10px)",
  borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  boxShadow: `0 4px 20px 0 ${alpha(theme.palette.common.black, 0.05)}`,
  position: "sticky",
  zIndex: theme.zIndex.appBar,
}));

const NavButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(0, 0.5),
  padding: theme.spacing(1, 2),
  borderRadius: theme.shape.borderRadius * 2,
  fontWeight: 500,
  fontSize: '0.9rem',
  letterSpacing: '0.5px',
  textTransform: "none",
  color: theme.palette.text.primary,
  transition: "all 0.3s",
  "&:hover": {
    background: alpha(theme.palette.primary.main, 0.1),
    transform: "translateY(-2px)",
  },
}));

const ActiveNavButton = styled(NavButton)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 700,
  position: "relative",
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: -2,
    left: "50%",
    transform: "translateX(-50%)",
    width: "30px",
    height: "3px",
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
    borderRadius: "3px",
    animation: `${fadeIn} 0.5s ease-out forwards`,
  },
}));

const LogoText = styled(Typography)(({ theme }) => ({
  flexGrow: 1,
  fontWeight: 700,
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  backgroundClip: "text",
  textFillColor: "transparent",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  display: "inline-block",
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(1),
  padding: theme.spacing(1, 2),
  minWidth: "200px",
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
  },
  "& .MuiSvgIcon-root": {
    fontSize: "1.1rem",
  },
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: theme.palette.success.main,
    color: theme.palette.success.contrastText,
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    animation: `${pulse} 2s infinite`,
  },
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 35,
  height: 35,
  backgroundColor: theme.palette.primary.dark,
  transition: "all 0.3s",
  "&:hover": {
    transform: "scale(1.05)",
  },
}));

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const navItems = [
    { name: "Home", path: "/", icon: <Home /> },
    { name: "Dashboard", path: "/dashboard", icon: <Dashboard /> },
    { name: "Crop Diagnosis", path: "/diagnosis", icon: <CameraAlt /> },
    { name: "Community", path: "/community", icon: <Forum /> },
    { name: "Weather", path: "/weather", icon: <WbSunny /> },
    { name: "Learning", path: "/learning", icon: <School /> },
    { name: "Voice Chat", path: "/voice-chat", icon: <Mic /> },
    { name: "Calendar", path: "/calendar", icon: <CalendarMonth /> },
    { name: "Market Prices", path: "/market", icon: <ShoppingCart /> },
  ];

  // Simplified authentication for demo
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    // Add effect for navbar animations or state management
  }, [location.pathname]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const renderNavItem = (item: { name: string; path: string; icon: React.ReactNode }, index: number) => {
    const isActive = location.pathname === item.path;
    
    if (isMobile) {
      return (
        <ListItem 
          key={item.path}
          onClick={() => {
            navigate(item.path);
            setMobileOpen(false);
          }}
          sx={{ 
            borderRadius: theme.shape.borderRadius,
            mb: 0.5,
            bgcolor: isActive ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
            color: isActive ? theme.palette.primary.main : theme.palette.text.primary,
            '&:hover': {
              bgcolor: alpha(theme.palette.primary.main, 0.05),
            },
          }}
        >
          <ListItemIcon 
            sx={{ 
              minWidth: 40,
              color: isActive ? theme.palette.primary.main : 'inherit'
            }}
          >
            {item.icon}
          </ListItemIcon>
          <ListItemText 
            primary={item.name} 
            primaryTypographyProps={{ 
              fontWeight: isActive ? 600 : 400,
            }}
          />
          {item.name === "Community" && (
            <Chip 
              label="New" 
              size="small" 
              color="primary" 
              sx={{ 
                height: 20, 
                fontSize: '0.65rem',
                fontWeight: 600,
              }} 
            />
          )}
        </ListItem>
      );
    }
    
    const NavButtonComponent = isActive ? ActiveNavButton : NavButton;
    
    return (
      <NavButtonComponent
        key={item.path}
        color="inherit"
        startIcon={item.icon}
        sx={{
          animation: `${fadeInDown} 0.5s ease-out ${index * 0.05}s forwards`,
          opacity: 0,
        }}
        onClick={() => navigate(item.path)}
      >
        {item.name}
      </NavButtonComponent>
    );
  };

  const open = Boolean(anchorEl);

  return (
    <>
    <StyledAppBar elevation={0}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {isMobile && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 1 }}
          >
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
        )}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={() => navigate("/")}
        >
          <LogoText variant="h6">Agropal</LogoText>
        </Box>

        {!isMobile && (
          <Box
            sx={{
              display: "flex",
              flexGrow: 1,
              justifyContent: "center",
              ml: 4,
            }}
          >
            {navItems.map(renderNavItem)}
          </Box>
        )}

        <Box sx={{ display: "flex", alignItems: "center" }}>
          {isAuthenticated ? (
            <>
              <IconButton
                aria-label="notifications"
                color="inherit"
                sx={{ ml: 1 }}
                onClick={() => navigate("/notifications")}
              >
                <StyledBadge badgeContent={3} color="error">
                  <Notifications />
                </StyledBadge>
              </IconButton>
              <IconButton
                onClick={handleMenuOpen}
                size="small"
                sx={{ ml: 1 }}
                aria-controls={open ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
              >
                <ProfileAvatar>
                  <AccountCircle />
                </ProfileAvatar>
              </IconButton>
            </>
          ) : (
            <>
              <Button
                variant="outlined"
                color="primary"
                size="small"
                onClick={() => navigate("/login")}
                sx={{ mr: 1, borderRadius: "20px" }}
              >
                Login
              </Button>
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => navigate("/register")}
                sx={{ borderRadius: "20px" }}
              >
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </StyledAppBar>

    <Menu
      anchorEl={anchorEl}
      id="account-menu"
      open={open}
      onClose={handleMenuClose}
      onClick={handleMenuClose}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      PaperProps={{
        elevation: 3,
        sx: {
          overflow: "visible",
          filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.15))",
          mt: 1.5,
          borderRadius: 2,
          "& .MuiAvatar-root": {
            width: 32,
            height: 32,
            ml: -0.5,
            mr: 1,
          },
        },
      }}
    >
      <StyledMenuItem
        onClick={() => {
          handleMenuClose();
          navigate("/profile");
        }}
      >
        <Person fontSize="small" color="primary" />
        Profile
      </StyledMenuItem>
      <StyledMenuItem
        onClick={() => {
          handleMenuClose();
          navigate("/notifications");
        }}
      >
        <Notifications fontSize="small" color="primary" />
        Notifications
      </StyledMenuItem>
      <StyledMenuItem
        onClick={() => {
          handleMenuClose();
          navigate("/settings");
        }}
      >
        <Settings fontSize="small" color="primary" />
        Settings
      </StyledMenuItem>
      <Divider sx={{ my: 1 }} />
      <StyledMenuItem
        onClick={() => {
          handleMenuClose();
          setIsAuthenticated(false);
        }}
      >
        <Logout fontSize="small" color="error" />
        Logout
      </StyledMenuItem>
    </Menu>

    <Drawer
      variant="temporary"
      open={mobileOpen}
      onClose={handleDrawerToggle}
      ModalProps={{
        keepMounted: true, // Better mobile performance
      }}
      sx={{
        display: { xs: "block", md: "none" },
        "& .MuiDrawer-paper": {
          boxSizing: "border-box",
          width: 280,
          backgroundColor: theme.palette.background.default,
          borderRight: `1px solid ${theme.palette.divider}`,
        },
      }}
    >
      <Box sx={{ p: 2, display: "flex", alignItems: "center" }}>
        <LogoText variant="h6">Agropal</LogoText>
      </Box>
      <Divider />
      <Box sx={{ p: 2 }}>
        {isAuthenticated && (
          <Box sx={{ mb: 2, display: "flex", alignItems: "center" }}>
            <Avatar
              sx={{
                width: 48,
                height: 48,
                bgcolor: theme.palette.primary.main,
                mr: 2,
              }}
            >
              <AccountCircle fontSize="large" />
            </Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight={600}>
                John Farmer
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Premium Member
              </Typography>
            </Box>
          </Box>
        )}
        <List>
          {navItems.map(renderNavItem)}
        </List>
      </Box>
    </Drawer>
    </>
  );
};

export default Navbar;
