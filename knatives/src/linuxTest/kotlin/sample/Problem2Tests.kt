package sample

import platform.linux.NSS_STATUS_RETURN
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class Problem2Tests {
    data class ListNode(var v: Int, val next: ListNode? = null) {


        fun toNumber(): Int {
            when(next) {
                null -> return v
                else -> return v + next.toNumber() * 10
            }
        }
    }

    fun toListNode(v:Int): ListNode? {
        if (v < 10) return ListNode(v)
        else {
            return ListNode(v%10, toListNode(v / 10))
        }
    }

    fun addTwoNumbers(l1: ListNode?, l2: ListNode?): ListNode? {
        fun _addTwo(l1: ListNode?, l2: ListNode?, c: Int): ListNode? {
            if (l1 == null && l2 == null) {
                if (c == 0) return null
                else ListNode(c)
            }
            val d1 = l1?.v ?: 0
            val d2 = l2?.v ?: 0
            val d3 = d1 + d2 + c
            return ListNode(d3%10, _addTwo(l1?.next, l2?.next, d3/10))
        }
        return _addTwo(l1, l2, 0)
    }

    @Test
    fun testHello() {
        assertEquals(21, ListNode(1, ListNode(2)).toNumber())
        println(toListNode(1))
        println(toListNode(321))
        assertEquals(3, addTwoNumbers(ListNode(1), ListNode(2))?.toNumber())
        assertEquals(200, addTwoNumbers(ListNode(7, ListNode(7, ListNode(1))),  ListNode(3, ListNode(2)))?.toNumber())
        assertEquals(123, addTwoNumbers(ListNode(3, ListNode(2, ListNode(1))),  ListNode(0))?.toNumber())

        for (p in listOf(Pair(342, 465), Pair(1000, 1), Pair(5, 5), Pair(9999, 1))) {
            assertEquals(p.first + p.second, addTwoNumbers(toListNode(p.first), toListNode(p.second))?.toNumber())
        }
        assertEquals(1, toListNode(1)?.toNumber())
        assertEquals(0, toListNode(0)?.toNumber())

    }
}