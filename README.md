## Requirement 
- PHP >= 8.1
- Laragon/Herd
- Redis
- [phpredis extension](https://dev.to/dendihandian/installing-php-redis-extension-on-laragon-2mp3) (Laragon)

## Installation
1. Clone the repository
```bash
git clone https://github.com/HansAndi/laravel-react-inertia.git
```
2. Install Composer
```bash
composer install
```
4. Copy .env.example to .env
```bash
cp .env.example .env
```
5. Generate key
```bash
php artisan key:generate
```
6. Migrate & seeding database
```bash
php artisan migrate --seed
```
7. Symbolic link
```bash
php artisan storage:link
```
8. Install NPM
```bash
npm install
```
9. Run NPM
```bash
npm run dev || npm run build
```
10. Run Laravel
```bash
php artisan serve
```
