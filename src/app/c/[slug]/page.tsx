import React, { Suspense } from 'react'
import WorkspaceClient from './workspace-client'
import { getCourseBySlug, COURSES_MOCK } from '@/lib/courses-data'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return COURSES_MOCK.map((course) => ({
    slug: course.slug,
  }))
}

export default async function CourseWorkspacePage({ params }: PageProps) {
  const { slug } = await params
  const course = (await getCourseBySlug(slug)) || COURSES_MOCK[0]

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center text-neutral-400">
          <span className="animate-pulse">Đang nạp không gian luyện tập...</span>
        </div>
      }
    >
      <WorkspaceClient initialCourse={course} slug={slug} />
    </Suspense>
  )
}
