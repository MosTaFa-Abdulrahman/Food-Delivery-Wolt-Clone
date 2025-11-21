import * as S from "./users.styles";
import { useState, useMemo, useCallback, useEffect } from "react";
import {
  Users as UsersIcon,
  User,
  Mail,
  MapPin,
  Calendar,
  Shield,
  Phone,
  Search,
  X,
} from "lucide-react";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";

// RTKQ
import { useGetUsersQuery } from "../../store/users/usersSlice";

function Users() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      // Reset to page 1 when search changes
      if (searchInput !== debouncedSearch) {
        setPage(1);
      }
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch users with search
  const {
    data: usersResponse,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useGetUsersQuery({
    page,
    size: pageSize,
    search: debouncedSearch,
  });

  // Handle user click - navigate to user details
  const handleUserClick = useCallback(
    (userId) => {
      navigate(`/admin/users/${userId}`);
    },
    [navigate]
  );

  // Clear search
  const handleClearSearch = () => {
    setSearchInput("");
    setDebouncedSearch("");
    setPage(1);
  };

  // Get role badge color
  const getRoleBadgeColor = (role) => {
    return role === "ADMIN" ? "#e74c3c" : "#3498db";
  };

  // Define columns
  const columns = useMemo(
    () => [
      {
        field: "user",
        headerName: "User",
        flex: 1,
        minWidth: 280,
        renderCell: (params) => (
          <S.UserInfo onClick={() => handleUserClick(params.row.id)}>
            <S.UserAvatar>
              {params.row.imgUrl ? (
                <S.AvatarImage
                  src={params.row.imgUrl}
                  alt={params.row.username}
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.parentElement.innerHTML = params.row.username
                      .charAt(0)
                      .toUpperCase();
                  }}
                />
              ) : (
                <S.AvatarPlaceholder>
                  {params.row.username.charAt(0).toUpperCase()}
                </S.AvatarPlaceholder>
              )}
            </S.UserAvatar>
            <S.UserDetails>
              <S.Username>{params.row.username}</S.Username>
              <S.UserEmail>
                <Mail size={12} />
                {params.row.email}
              </S.UserEmail>
            </S.UserDetails>
          </S.UserInfo>
        ),
      },
      {
        field: "fullName",
        headerName: "Full Name",
        flex: 1,
        minWidth: 180,
        renderCell: (params) => (
          <S.FullName>
            {params.row.firstName && params.row.lastName
              ? `${params.row.firstName} ${params.row.lastName}`
              : "-"}
          </S.FullName>
        ),
      },
      {
        field: "phoneNumber",
        headerName: "Phone",
        width: 150,
        renderCell: (params) => (
          <S.PhoneNumber>
            {params.row.phoneNumber ? (
              <>
                <Phone size={14} />
                {params.row.phoneNumber.replace(/"/g, "")}
              </>
            ) : (
              "-"
            )}
          </S.PhoneNumber>
        ),
      },
      {
        field: "city",
        headerName: "City",
        width: 130,
        renderCell: (params) => (
          <S.City>
            {params.row.city ? (
              <>
                <MapPin size={14} />
                {params.row.city}
              </>
            ) : (
              "-"
            )}
          </S.City>
        ),
      },
      {
        field: "role",
        headerName: "Role",
        width: 120,
        renderCell: (params) => (
          <S.RoleBadge $color={getRoleBadgeColor(params.row.role)}>
            <Shield size={14} />
            {params.row.role}
          </S.RoleBadge>
        ),
      },
      {
        field: "createdDate",
        headerName: "Joined Date",
        width: 180,
        renderCell: (params) => (
          <S.DateText>
            <Calendar size={14} />
            {new Date(params.row.createdDate).toLocaleDateString()}
          </S.DateText>
        ),
      },
    ],
    [handleUserClick]
  );

  // Prepare rows and pagination
  const rows = usersResponse?.data?.content || [];
  const totalRows = usersResponse?.data?.totalElements || 0;
  const totalPages = usersResponse?.data?.totalPages || 1;

  // Calculate statistics
  const stats = useMemo(() => {
    const allUsers = rows;
    return {
      total: totalRows,
      admins: allUsers.filter((u) => u.role === "ADMIN").length,
      users: allUsers.filter((u) => u.role === "USER").length,
      withPhone: allUsers.filter((u) => u.phoneNumber).length,
    };
  }, [rows, totalRows]);

  // Loading state
  if (isLoading && !usersResponse) {
    return (
      <S.Container>
        <S.StyledPaper>
          <S.LoadingContainer>
            <div>Loading users...</div>
          </S.LoadingContainer>
        </S.StyledPaper>
      </S.Container>
    );
  }

  // Error state
  if (isError) {
    return (
      <S.Container>
        <S.StyledPaper>
          <S.ErrorContainer>
            <S.ErrorText>
              {error?.data?.message || "Failed to load users"}
            </S.ErrorText>
            <S.RetryButton onClick={refetch}>Retry</S.RetryButton>
          </S.ErrorContainer>
        </S.StyledPaper>
      </S.Container>
    );
  }

  return (
    <S.Container>
      <S.Header>
        <S.Title>Users Management</S.Title>
        <S.Subtitle>
          View and manage all registered users in the system
        </S.Subtitle>
      </S.Header>

      {/* Statistics Cards */}
      <S.StatsGrid>
        <S.StatCard>
          <S.StatIcon $color="#3498db">
            <UsersIcon size={24} />
          </S.StatIcon>
          <S.StatContent>
            <S.StatLabel>Total Users</S.StatLabel>
            <S.StatValue>{stats.total}</S.StatValue>
          </S.StatContent>
        </S.StatCard>

        <S.StatCard>
          <S.StatIcon $color="#e74c3c">
            <Shield size={24} />
          </S.StatIcon>
          <S.StatContent>
            <S.StatLabel>Administrators</S.StatLabel>
            <S.StatValue>{stats.admins}</S.StatValue>
          </S.StatContent>
        </S.StatCard>

        <S.StatCard>
          <S.StatIcon $color="#27ae60">
            <User size={24} />
          </S.StatIcon>
          <S.StatContent>
            <S.StatLabel>Regular Users</S.StatLabel>
            <S.StatValue>{stats.users}</S.StatValue>
          </S.StatContent>
        </S.StatCard>

        <S.StatCard>
          <S.StatIcon $color="#9b59b6">
            <Phone size={24} />
          </S.StatIcon>
          <S.StatContent>
            <S.StatLabel>With Phone</S.StatLabel>
            <S.StatValue>{stats.withPhone}</S.StatValue>
          </S.StatContent>
        </S.StatCard>
      </S.StatsGrid>

      <S.StyledPaper>
        <S.ToolBar>
          <S.ToolBarTitle>
            <UsersIcon size={20} />
            All Users
          </S.ToolBarTitle>
          <S.SearchContainer>
            <S.SearchInputWrapper>
              <Search size={18} />
              <S.SearchInput
                type="text"
                placeholder="Search by name, email, username..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              {searchInput && (
                <S.ClearButton onClick={handleClearSearch}>
                  <X size={18} />
                </S.ClearButton>
              )}
              {isFetching && <S.SearchSpinner />}
            </S.SearchInputWrapper>
          </S.SearchContainer>
        </S.ToolBar>

        {debouncedSearch && (
          <S.SearchInfo>
            Showing results for: <strong>"{debouncedSearch}"</strong>
            {totalRows > 0 ? ` (${totalRows} found)` : " (No results)"}
          </S.SearchInfo>
        )}

        <S.TableWrapper>
          <DataGrid
            rows={rows}
            columns={columns}
            rowCount={totalRows}
            loading={isLoading || isFetching}
            pageSizeOptions={[5, 10, 25, 50]}
            paginationModel={{
              page: page - 1,
              pageSize: pageSize,
            }}
            onPaginationModelChange={(model) => {
              setPage(model.page + 1);
              setPageSize(model.pageSize);
            }}
            paginationMode="server"
            disableRowSelectionOnClick
            autoHeight
            getRowHeight={() => "auto"}
            sx={{
              "& .MuiDataGrid-cell": {
                py: 2,
              },
              "& .MuiDataGrid-row": {
                cursor: "pointer",
              },
            }}
          />
        </S.TableWrapper>
      </S.StyledPaper>
    </S.Container>
  );
}

export default Users;
