<?php

namespace App\Enums;

enum StatusPeminjaman: int
{
    case PENDING = 1;
    case LOAN = 2;
    case RETURN = 3;

    public function getStatus(): string
    {
        return match ($this) {
            self::PENDING => 'Pending',
            self::LOAN => 'On Loan',
            self::RETURN => 'Returned',
        };
    }

    public static function getOptions(): array
    {
        return [
            ['value' => self::PENDING, 'status' => self::PENDING->getStatus()],
            ['value' => self::LOAN, 'status' => self::LOAN->getStatus()],
            ['value' => self::RETURN, 'status' => self::RETURN->getStatus()],
        ];
    }
}