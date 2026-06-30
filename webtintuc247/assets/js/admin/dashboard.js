document.addEventListener("DOMContentLoaded", function() { 
    loadDashboard(); 
});

async function loadDashboard() {
    try {
        const response = await fetch(BASE_URL + 'api/admin/dashboard');
        const result = await response.json();

        if (result.status === 'success') {
            const dbWelcome = document.getElementById('dbWelcome');
            if (dbWelcome) dbWelcome.innerText = '👋 Xin chào, ' + result.data.name + '!';
            
            const dbNewsCount = document.getElementById('dbNewsCount');
            if (dbNewsCount) dbNewsCount.innerText = result.data.counts.news;
            
            const dbPendingCount = document.getElementById('dbPendingCount');
            if (dbPendingCount) dbPendingCount.innerText = result.data.counts.pending;
            
            const dbCatsCount = document.getElementById('dbCatsCount');
            if (dbCatsCount) dbCatsCount.innerText = result.data.counts.cats;

            if (result.data.role === 'admin') {
                const dbUsersCount = document.getElementById('dbUsersCount');
                if (dbUsersCount) dbUsersCount.innerText = result.data.counts.users;
                
                const dbUsersCard = document.getElementById('dbUsersCard');
                if (dbUsersCard) dbUsersCard.style.display = 'block';
            }

            let phtml = '';
            if (result.data.pending_list && result.data.pending_list.length > 0) {
                phtml = `<table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                            <thead><tr style="background: #f8f9fa; color: #555; text-align: left;">
                                <th style="padding: 10px; border-bottom: 2px solid #eee;">Tiêu đề</th>
                                <th style="padding: 10px; border-bottom: 2px solid #eee;">Ngày gửi</th>
                                <th style="padding: 10px; border-bottom: 2px solid #eee;">Hành động</th>
                            </tr></thead><tbody>`;
                result.data.pending_list.forEach(item => {
                    phtml += `<tr>
                        <td style="padding: 12px 10px; border-bottom: 1px solid #eee;">
                            <a href="${BASE_URL}admin/news/edit/${item.id}" style="text-decoration: none; color: #333; font-weight: 500;">
                                ${escapeHtml(item.tieude)}
                            </a>
                        </td>
                        <td style="padding: 12px 10px; border-bottom: 1px solid #eee; color: #777; font-size: 14px;">
                            ${new Date(item.ngaydang).toLocaleString('vi-VN')}
                        </td>
                        <td style="padding: 12px 10px; border-bottom: 1px solid #eee;">
                            <button onclick="approveNews(${item.id}, this)"
                                title="Duyệt bài"
                                style="background:#28a745; color:#fff; border:none; border-radius:6px; width:32px; height:32px; cursor:pointer; font-size:15px; margin-right:4px; transition:0.2s;"
                                onmouseover="this.style.background='#218838'" onmouseout="this.style.background='#28a745'">✔</button>
                            <button onclick="deleteNews(${item.id}, this)"
                                title="Xoá bài"
                                style="background:#dc3545; color:#fff; border:none; border-radius:6px; width:32px; height:32px; cursor:pointer; font-size:15px; transition:0.2s;"
                                onmouseover="this.style.background='#b02a37'" onmouseout="this.style.background='#dc3545'">🗑️</button>
                        </td>
                    </tr>`;
                });
                phtml += `</tbody></table>`;
            } else {
                phtml = `<p style="text-align: center; color: #999; margin-top: 20px;">Không có bài viết nào đang chờ duyệt.</p>`;
            }
            
            const dbPendingTasks = document.getElementById('dbPendingTasks');
            if (dbPendingTasks) dbPendingTasks.innerHTML = phtml;

            const dbLoading = document.getElementById('dbLoading');
            if (dbLoading) dbLoading.style.display = 'none';
            
            const dbUI = document.getElementById('dashboardUI');
            if (dbUI) dbUI.style.display = 'block';
        } else {
            const dbLoading = document.getElementById('dbLoading');
            if (dbLoading) dbLoading.innerHTML = `<p style="color:#dc3545;">⚠️ Lỗi tải dữ liệu: ${result.message || 'Không xác định'}</p>`;
            if (result.message && result.message.includes('Unauthorized')) {
                setTimeout(() => window.location.href = BASE_URL + 'admin/auth/login', 1500);
            }
        }
    } catch(e) {
        console.error("Dashboard error:", e);
        const dbLoading = document.getElementById('dbLoading');
        if (dbLoading) dbLoading.innerHTML = '<p style="color:#dc3545;">⚠️ Lỗi kết nối máy chủ. Vui lòng tải lại trang.</p>';
    }
}

function escapeHtml(unsafe) { 
    return (unsafe||'').toString().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); 
}

function showDashboardToast(message, type = 'success') {
    let toast = document.getElementById('dashboard-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'dashboard-toast';
        toast.style.cssText = 'position:fixed; bottom:28px; right:28px; z-index:9999; padding:14px 22px; border-radius:10px; font-weight:600; color:#fff; font-size:14px; box-shadow:0 6px 20px rgba(0,0,0,0.18); transition:opacity 0.4s, transform 0.4s; transform:translateY(20px); opacity:0;';
        document.body.appendChild(toast);
    }
    toast.style.backgroundColor = type === 'error' ? '#dc3545' : '#28a745';
    toast.innerHTML = (type === 'error' ? '❌ ' : '✅ ') + message;
    toast.style.display = 'block';
    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    });
    clearTimeout(toast._t);
    toast._t = setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        setTimeout(() => { toast.style.display = 'none'; }, 400);
    }, 3000);
}

async function approveNews(id, btn) {
    btn.disabled = true;
    btn.innerText = '...';
    try {
        const res = await fetch(BASE_URL + 'api/news/status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, status_action: 'approve' })
        });
        const result = await res.json();
        if (result.status === 'success') {
            const row = btn.closest('tr');
            if (row) row.style.transition = '0.3s'; 
            if (row) { row.style.opacity = '0'; setTimeout(() => row.remove(), 300); }
            const count = document.getElementById('dbPendingCount');
            if (count && !isNaN(parseInt(count.innerText))) count.innerText = Math.max(0, parseInt(count.innerText) - 1);
            showDashboardToast('Bài viết đã được duyệt và đăng lên!');
        } else {
            alert(result.message);
            btn.disabled = false; btn.innerText = '✔';
        }
    } catch(e) { alert('Lỗi kết nối!'); btn.disabled = false; btn.innerText = '✔'; }
}

async function deleteNews(id, btn) {
    if (!confirm('Bạn có chắc muốn xoá bài viết này?')) return;
    btn.disabled = true;
    btn.innerText = '...';
    try {
        const res = await fetch(BASE_URL + 'api/news/' + id, { method: 'DELETE' });
        const result = await res.json();
        if (result.status === 'success') {
            const row = btn.closest('tr');
            if (row) { row.style.opacity = '0'; row.style.transition = '0.3s'; setTimeout(() => row.remove(), 300); }
            const count = document.getElementById('dbPendingCount');
            if (count && !isNaN(parseInt(count.innerText))) count.innerText = Math.max(0, parseInt(count.innerText) - 1);
            showDashboardToast('Bài viết đã được xóa thành công!', 'error');
        } else {
            alert(result.message);
            btn.disabled = false; btn.innerText = '🗑';
        }
    } catch(e) { alert('Lỗi kết nối!'); btn.disabled = false; btn.innerText = '🗑'; }
}
