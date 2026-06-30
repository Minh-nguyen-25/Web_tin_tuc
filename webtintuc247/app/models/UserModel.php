<?php

class UserModel
{
    private Database $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function getById(int $id): mixed
    {
        return $this->db->fetch(
            "SELECT id, username, hoten, email, role, avatar, status FROM tbl_users WHERE id = ?",
            [$id]
        );
    }

    public function getAll(string $search = ''): array
    {
        if ($search !== '') {
            return $this->db->fetchAll(
                "SELECT id, username, hoten, email, role, avatar, status FROM tbl_users
                 WHERE username LIKE ? OR hoten LIKE ? OR email LIKE ?
                 ORDER BY id ASC",
                ["%$search%", "%$search%", "%$search%"]
            );
        }
        return $this->db->fetchAll(
            "SELECT id, username, hoten, email, role, avatar, status FROM tbl_users ORDER BY id ASC"
        );
    }

    public function existsByUsername(string $username): bool
    {
        $row = $this->db->fetch(
            "SELECT id FROM tbl_users WHERE username = ?",
            [$username]
        );
        return $row !== false;
    }

    public function create(string $username, string $password, string $hoten, string $email, string $role, string $status = 'active'): bool
    {
        $this->db->query(
            "INSERT INTO tbl_users (username, password, hoten, email, role, status) VALUES (?, ?, ?, ?, ?, ?)",
            [$username, $password, $hoten, $email, $role, $status]
        );
        return true;
    }

    public function update(int $id, string $hoten, string $email, string $role, ?string $password = null, string $status = 'active'): bool
    {
        if ($password !== null) {
            $this->db->query(
                "UPDATE tbl_users SET hoten = ?, email = ?, role = ?, password = ?, status = ? WHERE id = ?",
                [$hoten, $email, $role, $password, $status, $id]
            );
        } else {
            $this->db->query(
                "UPDATE tbl_users SET hoten = ?, email = ?, role = ?, status = ? WHERE id = ?",
                [$hoten, $email, $role, $status, $id]
            );
        }
        return true;
    }

    public function deleteById(int $id): bool
    {
        $this->db->query(
            "DELETE FROM tbl_users WHERE id = ?",
            [$id]
        );
        return true;
    }

    public function deleteByIds(array $ids): bool
    {
        if (empty($ids)) {
            return false;
        }
        $placeholders = implode(',', array_fill(0, count($ids), '?'));
        $this->db->query(
            "DELETE FROM tbl_users WHERE id IN ($placeholders)",
            $ids
        );
        return true;
    }
}
