import CandidateProfile from '@/components/user/CandidateProfile'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/user/vacancy/$id/$id/')({
  component: RouteComponent,
})

function RouteComponent() {
  return < CandidateProfile />
}
