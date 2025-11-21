import { NextResponse } from 'next/server';
import { execSync } from 'child_process';

export async function GET() {
  try {
    // Get the last commit information
    const commitHash = execSync('git log -1 --format="%H"', { encoding: 'utf-8' }).trim();
    const commitDate = execSync('git log -1 --format="%ci"', { encoding: 'utf-8' }).trim();
    const commitMessage = execSync('git log -1 --format="%s"', { encoding: 'utf-8' }).trim();
    
    // Parse the date and format it nicely
    const date = new Date(commitDate);
    const formattedDate = date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

    return NextResponse.json({
      commitHash: commitHash.substring(0, 7), // Short hash
      commitDate: formattedDate,
      commitMessage,
      timestamp: date.toISOString()
    });
  } catch (error) {
    // Fallback if git is not available
    const now = new Date();
    return NextResponse.json({
      commitHash: 'N/A',
      commitDate: now.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }),
      commitMessage: 'Build time',
      timestamp: now.toISOString()
    });
  }
}

