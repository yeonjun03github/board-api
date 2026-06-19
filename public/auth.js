/* =====================================================
   Auth 공유 유틸리티
   모든 페이지에서 <script src="/auth.js"></script> 로 사용
   ===================================================== */
const Auth = {
    _token: () => localStorage.getItem('_boardToken'),
    _user:  () => { try { return JSON.parse(localStorage.getItem('_boardUser') || 'null'); } catch { return null; } },

    isLoggedIn() { return !!this._token(); },
    getUser()    { return this._user(); },
    getToken()   { return this._token(); },

    setSession(token, user) {
        localStorage.setItem('_boardToken', token);
        localStorage.setItem('_boardUser', JSON.stringify(user));
    },

    clearSession() {
        localStorage.removeItem('_boardToken');
        localStorage.removeItem('_boardUser');
    },

    /** API 요청용 헤더 */
    headers() {
        const h = { 'Content-Type': 'application/json' };
        const t = this._token();
        if (t) h['Authorization'] = `Bearer ${t}`;
        return h;
    },

    /** 로그인 필요 페이지에서 호출 */
    requireLogin() {
        if (!this.isLoggedIn()) {
            window.location.href = '/login';
            return false;
        }
        return true;
    },

    logout() {
        this.clearSession();
        window.location.href = '/login';
    },

    /**
     * 헤더 우상단 인증 영역 렌더링
     * 각 페이지 header 안에 <div id="auth-area"></div> 필요
     */
    renderAuthArea(accentColor) {
        const el = document.getElementById('auth-area');
        if (!el) return;
        const color = accentColor || '#fff';
        const user = this._user();
        if (user) {
            el.innerHTML = `
                <span style="color:${color};font-size:14px;font-weight:500;">${escHtml(user.nickname)}님</span>
                <a href="/profile" title="내 정보 관리" style="color:${color};font-size:20px;text-decoration:none;line-height:1;" aria-label="내 정보">&#128100;</a>
                <button onclick="Auth.logout()" style="
                    background:rgba(255,255,255,0.18);border:none;color:${color};
                    font-size:13px;font-weight:500;padding:6px 14px;border-radius:8px;
                    cursor:pointer;font-family:inherit;">로그아웃</button>`;
        } else {
            el.innerHTML = `
                <a href="/login" style="
                    background:rgba(255,255,255,0.18);color:${color};text-decoration:none;
                    font-size:13px;font-weight:500;padding:6px 16px;border-radius:8px;">로그인</a>`;
        }
    },
};

function escHtml(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
