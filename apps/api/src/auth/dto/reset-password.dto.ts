import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
    @ApiProperty({
        description: 'Password reset token received via email',
        example: 'abc123def456',
    })
    @IsString()
    @IsNotEmpty({ message: 'Reset token is required' })
    token: string;

    @ApiProperty({
        description: 'New password for the user account',
        example: 'NewSecurePassword123!',
        minLength: 6,
    })
    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    @IsNotEmpty({ message: 'Password is required' })
    newPassword: string;
}
