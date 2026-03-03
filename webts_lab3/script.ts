interface User {
    id: string;
    name: string;
    lastName: string;
    phone: string;
    email: string;
    avatar: string;
}

interface Account {
    id: string;
    type: string;
    number: string;
    balance: number;
    currency: string;
    color: string;
    isMain: boolean;
}

interface Category {
    id: number;
    name: string;
    shortname: string;
    notes: string;
}

interface Transaction {
    id: string;
    date: string;
    merchant: string;
    category: string;
    amount: number;
    icon: string;
}

interface Analytics {
    income: number[];
    expenses: number[];
    months: string[];
    categories: { label: string; value: number; color: string }[];
}

interface Product {
    id: number;
    name: string;
    shortname: string;
    description: string;
    price: string;
    image: string;
}

interface AppData {
    user: User;
    accounts: Account[];
    transactions: Transaction[];
    analytics: Analytics;
    tips: string[];
}


declare const Chart: any;

class BankApp {
    private data: AppData | null = null;
    public isLoggedIn: boolean = false;

    constructor() {
        this.checkAuth();
        this.init();
    }

    private async init() {
        await this.loadData();
        (window as any).router = new Router(this);
        (window as any).router.handleInitialRoute();
    }

    private checkAuth() {
        this.isLoggedIn = localStorage.getItem('neo_logged_in') === 'true';
        this.updateNavUI();
    }

    private updateNavUI() {
        const nav = document.getElementById('main-nav');
        if (this.isLoggedIn) {
            nav?.classList.remove('hidden');
        } else {
            nav?.classList.add('hidden');
        }
    }

    private async loadData() {
        const savedData = localStorage.getItem('neo_data');
        if (savedData) {
            this.data = JSON.parse(savedData);
        } else {
            try {
                const response = await fetch('./data/mock-data.json');
                if (!response.ok) throw new Error("Failed to load mock data");
                this.data = await response.json();
                this.saveToStorage();
            } catch (error) {
                console.error("Data loading error:", error);
            }
        }
    }

    public login() {
        localStorage.setItem('neo_logged_in', 'true');
        this.isLoggedIn = true;
        this.checkAuth();
        (window as any).router.navigate('dashboard');
    }

    public logout() {
        localStorage.removeItem('neo_logged_in');
        this.isLoggedIn = false;
        this.checkAuth();
        (window as any).router.navigate('login');
    }

    public getData(): AppData | null {
        return this.data;
    }

    public saveToStorage() {
        if (this.data) {
            localStorage.setItem('neo_data', JSON.stringify(this.data));
        }
    }

    public addTransaction(tx: Transaction, amount: number) {
        if (!this.data) return;

        const mainAcc = this.data.accounts.find(a => a.isMain);
        if (mainAcc) {
            mainAcc.balance -= amount;
        }

        this.data.transactions.unshift(tx);
        this.saveToStorage();
    }
}

class Router {
    private routes: Record<string, () => void>;
    private app: BankApp;

    constructor(app: BankApp) {
        this.app = app;
        this.routes = {
            login: () => this.renderLogin(),
            dashboard: () => this.renderDashboard(),
            transfers: () => this.renderTransfers(),
            analytics: () => this.renderAnalytics(),
            catalog: () => this.renderCatalog()
        };
    }

    public navigate(page: string) {
        // Auth Guard
        if (page !== 'login' && page !== 'catalog' && !page.startsWith('category/') && !localStorage.getItem('neo_logged_in')) {
            page = 'login';
        }

        window.history.pushState({}, '', `#${page}`);

        // Dynamic Route Handler for Categories
        if (page.startsWith('category/')) {
            const shortname = page.split('/')[1];
            this.renderCategoryItems(shortname);
            return;
        }

        if (this.routes[page]) {
            this.routes[page]();
        } else {
            console.error(`Route ${page} not found`);
        }
    }

    public handleInitialRoute() {
        const hash = window.location.hash.replace('#', '') || (this.app.isLoggedIn ? 'dashboard' : 'login');
        this.navigate(hash);
    }

    private render(html: string) {
        const container = document.getElementById('app-content');
        if (container) {
            // Apply padding based on whether menu is visible
            const isDashboard = window.location.hash === '#dashboard' || window.location.hash === '#transfers' || window.location.hash === '#analytics';
            const paddingClass = isDashboard ? 'p-6 md:p-12 md:ml-20 mb-20 md:mb-0' : 'p-0';
            container.innerHTML = `<div class="page-enter ${paddingClass}">${html}</div>`;
        }
    }


    private renderLogin() {
        this.render(`
            <div class="flex items-center justify-center min-h-screen p-6">
                <div class="max-w-md w-full text-center">
                    <div class="mb-10">
                        <div class="w-20 h-20 bg-neo-blue rounded-[2.5rem] mx-auto flex items-center justify-center text-5xl font-bold shadow-2xl shadow-neo-blue/30 text-white">N</div>
                        <h1 class="text-4xl font-extrabold mt-6 tracking-tight text-white">NeoBank</h1>
                        <p class="text-slate-400 mt-2 font-medium">Цифровий банкінг нового покоління</p>
                    </div>
                    
                    <div class="bg-neo-card p-10 rounded-[3rem] shadow-2xl border border-slate-700/50 backdrop-blur-xl">
                        <div class="space-y-5">
                            <div class="text-left">
                                <label class="text-xs font-bold text-slate-500 uppercase ml-4 mb-2 block">Телефон або email</label>
                                <input id="login-id" type="text" placeholder="neo@bank.ua" class="w-full bg-slate-900/50 border border-slate-700 rounded-2xl p-4 focus:ring-2 focus:ring-neo-blue/50 focus:border-neo-blue outline-none transition-all placeholder:text-slate-600">
                            </div>
                            <div class="text-left">
                                <label class="text-xs font-bold text-slate-500 uppercase ml-4 mb-2 block">Пароль</label>
                                <input id="login-pass" type="password" placeholder="••••••••" class="w-full bg-slate-900/50 border border-slate-700 rounded-2xl p-4 focus:ring-2 focus:ring-neo-blue/50 focus:border-neo-blue outline-none transition-all placeholder:text-slate-600">
                            </div>
                            <button onclick="app.login()" class="w-full bg-neo-blue hover:bg-sky-400 text-white font-bold py-5 rounded-2xl transition-all shadow-xl shadow-neo-blue/20 active:scale-95 mt-4">
                                Увійти в кабінет
                            </button>
                        </div>
                        <div class="flex flex-col gap-4 mt-8 pt-6 border-t border-slate-700/30 text-sm font-medium">
                            <a href="#" class="text-slate-400 hover:text-neo-blue transition-colors">Забули пароль?</a>
                            <div class="text-slate-500">
                                Немає картки? <a href="#" class="text-neo-accent hover:underline">Стати клієнтом</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `);
    }

    private renderDashboard() {
        const data = this.app.getData();
        if (!data) return;

        const mainAcc = data.accounts.find(a => a.isMain);
        const otherAccs = data.accounts.filter(a => !a.isMain);

        const txRows = data.transactions.slice(0, 5).map(tx => `
            <div class="flex items-center justify-between p-4 hover:bg-slate-800/40 rounded-3xl transition-all cursor-pointer group border border-transparent hover:border-slate-700/50">
                <div class="flex items-center gap-4">
                    <div class="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">${tx.icon}</div>
                    <div>
                        <div class="font-bold text-slate-100">${tx.merchant}</div>
                        <div class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">${tx.category}</div>
                    </div>
                </div>
                <div class="font-extrabold text-lg ${tx.amount < 0 ? 'text-white' : 'text-green-400'}">
                    ${tx.amount < 0 ? '' : '+'}${tx.amount.toFixed(2)} ${mainAcc?.currency}
                </div>
            </div>
        `).join('');

        this.render(`
            <header class="flex justify-between items-center mb-10">
                <div>
                    <h2 class="text-3xl font-black text-white">Добрий день, ${data.user.name}!</h2>
                    <p class="text-slate-400 font-medium">Ваші фінанси під контролем</p>
                </div>
                <div class="relative group cursor-pointer">
                    <img src="${data.user.avatar}" class="w-14 h-14 rounded-2xl border-2 border-neo-blue/30 group-hover:border-neo-blue transition-all">
                    <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-neo-dark rounded-full"></div>
                </div>
            </header>

            <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <!-- Balance & Quick Actions -->
                <div class="xl:col-span-2 space-y-8">
                    <!-- MAIN CARD -->
                    <div class="card-gradient ${mainAcc?.color} p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group">
                        <div class="absolute -right-20 -top-20 w-80 h-80 bg-white/5 rounded-full blur-3xl group-hover:scale-150 transition-all duration-1000"></div>
                        <div class="relative z-10">
                            <div class="flex justify-between items-start mb-4">
                                <span class="text-sm font-bold opacity-70 uppercase tracking-widest">${mainAcc?.type}</span>
                                <div class="w-10 h-6 bg-yellow-500/20 rounded-md border border-yellow-500/30"></div>
                            </div>
                            <div class="text-6xl font-black mb-10 tracking-tighter">${mainAcc?.balance.toLocaleString()} ${mainAcc?.currency}</div>
                            <div class="flex justify-between items-end">
                                <div class="font-mono text-xl opacity-80 tracking-widest">${mainAcc?.number}</div>
                                <div class="flex flex-col items-end">
                                    <span class="text-3xl font-black italic opacity-90">VISA</span>
                                    <span class="text-[10px] font-bold opacity-50 uppercase">Neo Exclusive</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- QUICK ACTIONS -->
                    <div class="grid grid-cols-4 gap-4">
                        ${this.qBtn('💸', 'Переказ', "router.navigate('transfers')")}
                        ${this.qBtn('🥘', 'Оплата', "")}
                        ${this.qBtn('📈', 'Поповнити', "")}
                        ${this.qBtn('🎯', 'Цілі', "")}
                    </div>

                    <!-- RECENT ACTIVITY -->
                    <div class="bg-neo-card rounded-[3rem] p-8 border border-slate-700/40">
                        <div class="flex justify-between items-center mb-8">
                            <h3 class="text-xl font-black text-white px-2">Останні транзакції</h3>
                            <button class="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold px-4 py-2 rounded-xl transition-all">ДЕТАЛЬНІШЕ</button>
                        </div>
                        <div class="space-y-2">${txRows}</div>
                    </div>
                </div>

                <!-- SIDEBAR -->
                <div class="space-y-8">
                    <!-- MINICHART -->
                    <div class="bg-neo-card rounded-[3rem] p-8 border border-slate-700/40 text-center relative overflow-hidden">
                        <h3 class="text-lg font-bold mb-8">Витрати за тиждень</h3>
                        <div class="relative w-48 h-48 mx-auto mb-6">
                             <svg viewBox="0 0 36 36" class="w-full h-full transform -rotate-90">
                                <circle cx="18" cy="18" r="16" fill="none" class="stroke-slate-800" stroke-width="4"></circle>
                                <circle cx="18" cy="18" r="16" fill="none" class="stroke-neo-blue" stroke-width="4" stroke-dasharray="68, 100" stroke-linecap="round"></circle>
                            </svg>
                            <div class="absolute inset-0 flex flex-col items-center justify-center">
                                <span class="text-3xl font-black text-white">68%</span>
                                <span class="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Ліміт</span>
                            </div>
                        </div>
                        <p class="text-sm font-medium text-slate-400">Ви використали <span class="text-white">12,400 ₴</span> з вашого місячного бюджету</p>
                    </div>

                    <!-- OTHER ACCOUNTS -->
                    <div class="space-y-4">
                        <h3 class="text-xl font-bold px-4">Скарбничка та Рахунки</h3>
                        ${otherAccs.map(acc => `
                            <div class="bg-neo-card p-5 rounded-[2rem] border border-slate-700/40 flex justify-between items-center group cursor-pointer hover:border-neo-blue/50 transition-all active:scale-95">
                                <div class="flex items-center gap-4">
                                    <div class="w-12 h-12 card-gradient ${acc.color} rounded-2xl shadow-lg shadow-black/20"></div>
                                    <div>
                                        <div class="text-sm font-black text-white">${acc.type}</div>
                                        <div class="text-[10px] font-bold text-slate-500 uppercase">${acc.number}</div>
                                    </div>
                                </div>
                                <div class="font-black text-lg text-white">${acc.balance.toLocaleString()} ${acc.currency}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `);
    }

    private qBtn(icon: string, label: string, action: string) {
        return `
            <button onclick="${action}" class="flex flex-col items-center gap-3 group">
                <div class="w-16 h-16 bg-neo-card border border-slate-700/50 rounded-[2rem] flex items-center justify-center text-3xl group-hover:bg-neo-blue group-hover:text-white transition-all shadow-xl group-hover:shadow-neo-blue/30 active:scale-90">
                    ${icon}
                </div>
                <span class="text-[11px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-white transition-colors">${label}</span>
            </button>
        `;
    }

    private renderTransfers() {
        const data = this.app.getData();
        if (!data) return;
        const mainAcc = data.accounts.find(a => a.isMain);

        this.render(`
            <div class="max-w-2xl mx-auto">
                <h2 class="text-4xl font-black mb-10 text-white">Здійснити переказ</h2>
                
                <div class="bg-neo-card p-10 rounded-[3rem] border border-slate-700/40 shadow-2xl">
                    <div class="space-y-8">
                        <div>
                            <label class="text-xs font-black text-slate-500 uppercase ml-4 mb-3 block tracking-widest">Джерело коштів</label>
                            <div class="flex items-center gap-4 bg-slate-900/50 border border-slate-700 rounded-3xl p-5">
                                 <div class="w-12 h-12 card-gradient ${mainAcc?.color} rounded-2xl"></div>
                                 <div class="flex-grow">
                                    <div class="font-black text-white">${mainAcc?.type}</div>
                                    <div class="text-xs font-bold text-slate-500">${mainAcc?.number}</div>
                                 </div>
                                 <div class="text-right">
                                    <div class="font-black text-white">${mainAcc?.balance.toLocaleString()} ${mainAcc?.currency}</div>
                                    <div class="text-[10px] text-slate-500 font-bold uppercase">Доступно</div>
                                 </div>
                            </div>
                        </div>

                        <div>
                            <label class="text-xs font-black text-slate-500 uppercase ml-4 mb-3 block tracking-widest">Одержувач</label>
                            <div class="relative">
                                <input id="tx-to" type="text" placeholder="Номер картки або телефону" class="w-full bg-slate-900/50 border border-slate-700 rounded-[2rem] p-5 pl-14 focus:ring-2 focus:ring-neo-blue/50 focus:border-neo-blue outline-none transition-all placeholder:text-slate-700 font-bold">
                                <span class="absolute left-5 top-5 text-2xl">👤</span>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label class="text-xs font-black text-slate-500 uppercase ml-4 mb-3 block tracking-widest">Сума (${mainAcc?.currency})</label>
                                <input id="tx-amount" type="number" placeholder="0.00" class="w-full bg-slate-900/50 border border-slate-700 rounded-[2rem] p-5 focus:ring-2 focus:ring-neo-blue/50 focus:border-neo-blue outline-none transition-all text-3xl font-black text-white placeholder:text-slate-800">
                            </div>
                            <div>
                                <label class="text-xs font-black text-slate-500 uppercase ml-4 mb-3 block tracking-widest">Призначення</label>
                                <input id="tx-comment" type="text" placeholder="За каву / Повернення боргу" class="w-full bg-slate-900/50 border border-slate-700 rounded-[2rem] p-5 focus:ring-2 focus:ring-neo-blue/50 focus:border-neo-blue outline-none transition-all font-medium placeholder:text-slate-700">
                            </div>
                        </div>

                        <button id="send-btn" class="w-full bg-neo-blue hover:bg-sky-400 text-white font-black py-6 rounded-[2rem] transition-all shadow-2xl shadow-neo-blue/30 text-xl active:scale-95 mt-4">
                            Надіслати гроші
                        </button>
                        
                        <div id="tx-done" class="hidden bg-green-500/10 border border-green-500/30 text-green-400 p-6 rounded-[2rem] text-center font-bold text-lg animate-bounce">
                            💎 ТРАНЗАКЦІЯ УСПІШНА!
                        </div>
                    </div>
                </div>
            </div>
        `);

        document.getElementById('send-btn')?.addEventListener('click', () => {
            const to = (document.getElementById('tx-to') as HTMLInputElement).value;
            const amount = parseFloat((document.getElementById('tx-amount') as HTMLInputElement).value);
            const comment = (document.getElementById('tx-comment') as HTMLInputElement).value;

            if (to && amount > 0) {
                const newTx: Transaction = {
                    id: 'tx_' + Date.now(),
                    date: new Date().toISOString(),
                    merchant: to,
                    category: 'Переказ',
                    amount: -amount,
                    icon: '💸'
                };
                this.app.addTransaction(newTx, amount);

                document.getElementById('tx-done')?.classList.remove('hidden');
                setTimeout(() => this.navigate('dashboard'), 2000);
            } else {
                alert("Будь ласка, вкажіть коректну суму та одержувача");
            }
        });
    }

    private renderAnalytics() {
        const data = this.app.getData();
        if (!data) return;
        const analytics = data.analytics;

        this.render(`
            <h2 class="text-4xl font-black mb-10 text-white">Аналітика витрат</h2>
            
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                <!-- Main Spending Chart -->
                <div class="bg-neo-card p-8 rounded-[3rem] border border-slate-700/40 shadow-xl">
                    <h3 class="text-lg font-black mb-10 uppercase tracking-widest text-slate-500 px-2">Динаміка рахунку</h3>
                    <div class="h-64">
                        <canvas id="mainChart"></canvas>
                    </div>
                </div>

                <!-- Categories -->
                <div class="bg-neo-card p-8 rounded-[3rem] border border-slate-700/40 shadow-xl">
                    <h3 class="text-lg font-black mb-10 uppercase tracking-widest text-slate-500 px-2">Категорії витрат</h3>
                    <div class="h-64 flex items-center justify-center">
                        <canvas id="pieChart"></canvas>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <!-- TOP EXPENSES -->
                <div class="xl:col-span-2 bg-neo-card p-10 rounded-[3rem] border border-slate-700/40">
                    <h3 class="text-xl font-black mb-10 text-white">ТОП-5 найбільших витрат</h3>
                    <div class="space-y-8">
                        ${data.transactions.filter(t => t.amount < 0).slice(0, 5).map(tx => `
                            <div>
                                <div class="flex justify-between items-center mb-3">
                                    <span class="text-slate-300 font-bold text-lg">${tx.merchant}</span>
                                    <span class="font-black text-white text-xl">${Math.abs(tx.amount).toFixed(2)} ₴</span>
                                </div>
                                <div class="w-full bg-slate-900/50 h-3 rounded-full overflow-hidden">
                                    <div class="bg-neo-blue h-full rounded-full shadow-[0_0_10px_rgba(0,170,255,0.5)]" style="width: ${Math.random() * 50 + 30}%"></div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- TIPS SECTION -->
                <div class="space-y-8">
                    <div class="bg-neo-blue/10 border border-neo-blue/30 p-8 rounded-[2.5rem] relative overflow-hidden group">
                        <div class="absolute -right-4 -top-4 text-7xl opacity-10 group-hover:scale-125 transition-transform duration-700">💡</div>
                        <h4 class="font-black text-neo-accent text-xl mb-4">Порада Neo AI</h4>
                        <p class="text-slate-300 font-medium leading-relaxed italic">"${data.tips[Math.floor(Math.random() * data.tips.length)]}"</p>
                    </div>
                    
                    <div class="bg-neo-card p-8 rounded-[2.5rem] border border-slate-700/40">
                        <h4 class="font-black text-white mb-6">Порівняння місяців</h4>
                        <div class="flex justify-center items-end h-32 gap-6 pb-2">
                             <div class="w-12 bg-slate-800 rounded-2xl relative group">
                                <div class="absolute bottom-0 w-full bg-slate-600 rounded-2xl transition-all duration-1000" style="height: 85%"></div>
                                <span class="absolute -bottom-7 left-0 right-0 text-[10px] text-center font-black text-slate-500">ЛЮТ</span>
                             </div>
                             <div class="w-12 bg-slate-800 rounded-2xl relative group">
                                <div class="absolute bottom-0 w-full bg-neo-blue rounded-2xl transition-all duration-1000 shadow-[0_0_15px_rgba(0,170,255,0.4)]" style="height: 65%"></div>
                                <span class="absolute -bottom-7 left-0 right-0 text-[10px] text-center font-black text-neo-blue">БЕР</span>
                             </div>
                        </div>
                        <p class="text-[11px] text-slate-500 mt-12 text-center font-bold uppercase tracking-widest">Витрати зменшились на <span class="text-green-400">15%</span></p>
                    </div>
                </div>
            </div>
        `);

        setTimeout(() => {
            const chartConfig = {
                color: '#94a3b8',
                font: { family: 'Inter', size: 10, weight: '600' }
            };

            new Chart(document.getElementById('mainChart') as HTMLCanvasElement, {
                type: 'line',
                data: {
                    labels: analytics.months,
                    datasets: [
                        { label: 'Доходи', data: analytics.income, borderColor: '#38bdf8', backgroundColor: 'rgba(56, 189, 248, 0.1)', tension: 0.4, fill: true, borderWidth: 4, pointRadius: 0 },
                        { label: 'Витрати', data: analytics.expenses, borderColor: '#ffffff', borderDash: [5, 5], tension: 0.4, fill: false, borderWidth: 2, pointRadius: 0 }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { display: false },
                        x: {
                            grid: { display: false },
                            border: { display: false },
                            ticks: chartConfig
                        }
                    }
                }
            });

            new Chart(document.getElementById('pieChart') as HTMLCanvasElement, {
                type: 'doughnut',
                data: {
                    labels: analytics.categories.map(c => c.label),
                    datasets: [{
                        data: analytics.categories.map(c => c.value),
                        backgroundColor: analytics.categories.map(c => c.color),
                        borderWidth: 0,
                        hoverOffset: 15
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '75%',
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                color: '#94a3b8',
                                usePointStyle: true,
                                pointStyle: 'circle',
                                padding: 20,
                                font: chartConfig.font
                            }
                        }
                    }
                }
            });
        }, 150);
    }

    private async renderCatalog() {
        try {
            const response = await fetch('./data/categories.json');
            const categories: Category[] = await response.json();

            const categoryLinks = categories.map(cat => `
                <button onclick="router.navigate('category/${cat.shortname}')" class="bg-neo-card p-8 rounded-[2.5rem] border border-slate-700/40 hover:border-neo-blue transition-all group text-left">
                    <div class="text-2xl mb-4 group-hover:scale-110 transition-transform">📁</div>
                    <h3 class="text-xl font-black text-white mb-2">${cat.name}</h3>
                    <p class="text-sm text-slate-400 font-medium">${cat.notes}</p>
                </button>
            `).join('');

            const randomCategory = categories[Math.floor(Math.random() * categories.length)];

            this.render(`
                <div class="max-w-6xl mx-auto py-10">
                    <h2 class="text-4xl font-black text-white mb-10 text-center uppercase tracking-tighter">Наш Каталог</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                        ${categoryLinks}
                    </div>
                    
                    <div class="border-t border-slate-800 pt-12 text-center">
                        <h3 class="text-xl font-black text-neo-accent mb-6 uppercase tracking-widest">Пропозиція дня</h3>
                        <button onclick="router.navigate('category/${randomCategory.shortname}')" 
                                class="bg-neo-blue/10 border border-neo-blue/30 px-10 py-6 rounded-[2rem] text-neo-blue font-black text-xl hover:bg-neo-blue hover:text-white transition-all shadow-2xl shadow-neo-blue/10">
                            ✨ SPECIALS: ${randomCategory.name}
                        </button>
                    </div>
                </div>
            `);
        } catch (error) {
            console.error("Error loading categories:", error);
        }
    }

    private async renderCategoryItems(shortname: string) {
        try {
            const response = await fetch(`./data/${shortname}.json`);
            if (!response.ok) throw new Error("Category file not found");
            const data: { categoryName: string, items: Product[] } = await response.json();

            const itemsHtml = data.items.map(item => `
                <div class="bg-neo-card rounded-[2.5rem] border border-slate-700/40 overflow-hidden group hover:border-neo-blue transition-all shadow-xl">
                    <img src="${item.image}" alt="${item.name}" class="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700">
                    <div class="p-6">
                        <div class="flex justify-between items-start mb-2">
                            <h3 class="text-xl font-bold text-white">${item.name}</h3>
                            <span class="bg-neo-blue/20 text-neo-blue text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-tighter">${item.price}</span>
                        </div>
                        <p class="text-xs text-slate-400 font-medium leading-relaxed mb-6">${item.description}</p>
                        <button class="w-full bg-slate-800 hover:bg-neo-blue text-white font-bold py-3 rounded-2xl transition-all text-xs uppercase tracking-widest">
                            Детальніше
                        </button>
                    </div>
                </div>
            `).join('');

            this.render(`
                <div class="max-w-6xl mx-auto py-10">
                    <div class="flex items-center gap-4 mb-10">
                        <button onclick="router.navigate('catalog')" class="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors">←</button>
                        <h2 class="text-3xl font-black text-white uppercase tracking-tighter">${data.categoryName}</h2>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        ${itemsHtml}
                    </div>
                </div>
            `);
        } catch (error) {
            console.error("Error loading items:", error);
            this.render(`<div class="text-center py-20"><h2 class="text-2xl font-bold">Категорію не знайдено</h2></div>`);
        }
    }
}

const app = new BankApp();
const router = new Router(app);
