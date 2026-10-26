<?php

// Run through Laravel Tinker on the live Cargo-Mangr backend, not on the mobile app.
// Set NWC_PLAY_REVIEW_PASSWORD in the process environment before running:
// php artisan tinker --execute="require '/absolute/path/provision-play-reviewer.php';"

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Modules\Cargo\Entities\Client;

if (PHP_SAPI !== 'cli' || !function_exists('app') || !app()->runningInConsole()) {
    throw new RuntimeException('Run this script inside the Laravel console only.');
}

$password = getenv('NWC_PLAY_REVIEW_PASSWORD');
if (!$password || strlen($password) < 16) {
    throw new RuntimeException('Set NWC_PLAY_REVIEW_PASSWORD to at least 16 characters.');
}

$email = 'playreview@newworldcargo.com';
DB::transaction(function () use ($email, $password) {
    if (User::where('email', $email)->exists() || Client::where('email', $email)->exists()) {
        throw new RuntimeException('Reviewer identity already exists. No account or password was changed.');
    }

    $user = new User();
    $user->name = 'Google Play Reviewer';
    $user->email = $email;
    $user->password = Hash::make($password);
    $user->role = 4;
    $user->verified = true;
    $user->email_verified_at = now();
    $user->responsible_mobile = null;
    $user->save();

    $client = new Client();
    $client->code = 0;
    $client->user_id = $user->id;
    $client->name = $user->name;
    $client->email = $email;
    $client->responsible_name = $user->name;
    $client->responsible_mobile = null;
    $client->is_archived = 0;
    $client->created_by = $user->id;
    $client->save();
    $client->code = $client->id;
    $client->save();
});

echo "Created verified customer account: {$email}\n";
echo "Use the password supplied in NWC_PLAY_REVIEW_PASSWORD. No app rebuild is required.\n";
