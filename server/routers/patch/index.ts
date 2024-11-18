import { router } from '~/lib/trpc'
import { getPatchById, togglePatchFavorite, updatePatchBanner } from './patch'
import { getPatchIntroduction, handleAddPatchTag } from './introduction'
import {
  createPatchResource,
  getPatchResource,
  updatePatchResource,
  toggleResourceLike,
  deleteResource
} from './resource'
import {
  publishPatchComment,
  getPatchComment,
  toggleCommentLike,
  deleteComment,
  updateComment
} from './comment'
import { getPatchHistory } from './history'
import {
  getPullRequest,
  mergePullRequest,
  declinePullRequest
} from './pull-request'
import { getPatchContributor } from './contributor'

export const patchRouter = router({
  getPatchById,
  togglePatchFavorite,
  updatePatchBanner,

  getPatchIntroduction,
  handleAddPatchTag,

  createPatchResource,
  getPatchResource,
  updatePatchResource,
  toggleResourceLike,
  deleteResource,

  publishPatchComment,
  getPatchComment,
  toggleCommentLike,
  deleteComment,
  updateComment,

  getPatchHistory,

  getPullRequest,
  mergePullRequest,
  declinePullRequest,

  getPatchContributor
})
