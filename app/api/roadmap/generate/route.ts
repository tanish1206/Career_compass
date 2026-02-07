import { NextRequest, NextResponse } from 'next/server';
import { generatePersonalizedRoadmap } from '@/lib/ai';
import { frontendRoadmap } from '@/lib/data';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const { role, currentSkills, hoursPerDay, timelineWeeks } = body;

        // Validate input
        if (!role || !currentSkills || !hoursPerDay || !timelineWeeks) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Validate skill ranges
        if (
            currentSkills.dsa < 0 || currentSkills.dsa > 100 ||
            currentSkills.coreCS < 0 || currentSkills.coreCS > 100 ||
            currentSkills.frameworks < 0 || currentSkills.frameworks > 100
        ) {
            return NextResponse.json(
                { error: 'Skills must be between 0-100' },
                { status: 400 }
            );
        }

        // Validate hours and timeline
        if (hoursPerDay < 1 || hoursPerDay > 12) {
            return NextResponse.json(
                { error: 'Hours per day must be between 1-12' },
                { status: 400 }
            );
        }

        if (timelineWeeks < 2 || timelineWeeks > 16) {
            return NextResponse.json(
                { error: 'Timeline must be between 2-16 weeks' },
                { status: 400 }
            );
        }

        // Generate roadmap with AI
        const roadmap = await generatePersonalizedRoadmap({
            role,
            currentSkills,
            hoursPerDay,
            timelineWeeks
        });

        return NextResponse.json({ roadmap });

    } catch (error) {
        console.error('Roadmap generation error:', error);

        // Fallback to default roadmap
        return NextResponse.json({
            roadmap: frontendRoadmap,
            fallback: true,
            message: 'Using default roadmap. AI unavailable.'
        });
    }
}
